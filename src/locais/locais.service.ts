import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

type MunicipioInfo = { id: string; nome: string; uf: string };

@Injectable()
export class LocaisService implements OnModuleInit {
    private municipioById     = new Map<string, MunicipioInfo>();
    private municipioIdsByNorm = new Map<string, string[]>();           // nome normalizado → ids
    private bairrosByMunicipioId = new Map<string, string[]>();

    onModuleInit() {
        this.carregarMunicipios();
        this.carregarBairros();
    }

    private norm(s: string) {
        return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    }

    private carregarMunicipios() {
        const lines = readFileSync(join(process.cwd(), 'csv-locais', 'municipios.csv'), 'utf-8').split('\n');
        for (const line of lines) {
            const parts = line.split(',');
            const id = parts[0]?.trim();
            const nome = parts[1]?.trim();
            const uf = parts[2]?.trim();
            if (!id || !nome || !uf) continue;
            this.municipioById.set(id, { id, nome, uf });
            const key = this.norm(nome);
            if (!this.municipioIdsByNorm.has(key)) this.municipioIdsByNorm.set(key, []);
            this.municipioIdsByNorm.get(key)!.push(id);
        }
    }

    private carregarBairros() {
        const lines = readFileSync(join(process.cwd(), 'csv-locais', 'bairros.csv'), 'utf-8').split('\n');
        for (const line of lines) {
            const parts = line.split(',');
            const nome = parts[1]?.trim();
            const municipioId = parts[2]?.trim();
            if (!nome || !municipioId) continue;
            if (!this.bairrosByMunicipioId.has(municipioId)) this.bairrosByMunicipioId.set(municipioId, []);
            this.bairrosByMunicipioId.get(municipioId)!.push(nome);
        }
    }

    buscarMunicipiosPorEstado(uf: string): string[] {
        const ufUpper = uf.toUpperCase().trim();
        return Array.from(this.municipioById.values())
            .filter(m => m.uf === ufUpper)
            .map(m => m.nome)
            .sort();
    }

    buscarBairrosPorCidade(cidade: string, estado?: string): Array<{ municipio: string; uf: string; bairros: string[] }> {
        const ids = this.municipioIdsByNorm.get(this.norm(cidade)) ?? [];
        const matches = ids
            .map(id => this.municipioById.get(id)!)
            .filter(m => !estado || m.uf === estado.toUpperCase().trim());

        return matches.map(m => ({
            municipio: m.nome,
            uf: m.uf,
            bairros: (this.bairrosByMunicipioId.get(m.id) ?? []).sort(),
        }));
    }
}
