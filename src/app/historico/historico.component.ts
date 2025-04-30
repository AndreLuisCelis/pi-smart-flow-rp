import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';

export interface infoHistoricoAtendiementos {
  tipoAtendimento: string;
  totalAtendimentos: number;
  tempoMedioEspera: string;
  tempoMedioAtendimento: string;
}

const ATENDIMENTO_DATA: infoHistoricoAtendiementos[] = [
  { tipoAtendimento: 'Cardiologia', totalAtendimentos: 50, tempoMedioEspera: '8 min', tempoMedioAtendimento: '30 min' },
  { tipoAtendimento: 'Neurologia', totalAtendimentos: 40, tempoMedioEspera: '12 min', tempoMedioAtendimento: '35 min' },
  { tipoAtendimento: 'Dermatologia', totalAtendimentos: 25, tempoMedioEspera: '10 min', tempoMedioAtendimento: '20 min' },
  { tipoAtendimento: 'Oftalmologia', totalAtendimentos: 15, tempoMedioEspera: '7 min', tempoMedioAtendimento: '18 min' },
  { tipoAtendimento: 'Pediatria', totalAtendimentos: 30, tempoMedioEspera: '9 min', tempoMedioAtendimento: '25 min' },
  { tipoAtendimento: 'Ortopedia', totalAtendimentos: 20, tempoMedioEspera: '11 min', tempoMedioAtendimento: '28 min' },
  { tipoAtendimento: 'Ginecologia', totalAtendimentos: 35, tempoMedioEspera: '10 min', tempoMedioAtendimento: '32 min' },
  { tipoAtendimento: 'Psiquiatria', totalAtendimentos: 18, tempoMedioEspera: '15 min', tempoMedioAtendimento: '40 min' },
];

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.css'
})
export class HistoricoComponent {
  data: { tipo: string; displayedColumns: string[]; dataSource: infoHistoricoAtendiementos[] }[] = [];
  displayedColumns: string[] = ['tipoAtendimento', 'totalAtendimentos', 'tempoMedioEspera', 'tempoMedioAtendimento',];
  dataSource = ATENDIMENTO_DATA;

  private breakpointObserver = inject(BreakpointObserver);
  isXsmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit() {
    this.getData();
    this.monitorarExibicaoColunas(); 
  }
  getData() {
    this.data.push(
      {
        tipo: 'Diario',
        displayedColumns: this.displayedColumns,
        dataSource: this.gerarDataSource(this.dataSource, 1)
      },
      {
        tipo: 'Semanal',
        displayedColumns: this.displayedColumns,
        dataSource: this.gerarDataSource(this.dataSource, 7)
      },
      {
        tipo: 'Mensal',
        displayedColumns: this.displayedColumns,
        dataSource: this.gerarDataSource(this.dataSource, 30)
      },
    )
  }

  monitorarExibicaoColunas() {
    this.isXsmall$.subscribe(isXsmall => {  
      if (isXsmall) {
        this.removerColunas();
      } else {
        this.displayedColumns = ['tipoAtendimento', 'totalAtendimentos', 'tempoMedioEspera', 'tempoMedioAtendimento'];
        this.data.forEach(item => {
          item.displayedColumns = [...this.displayedColumns];
        });
      }
    }); 
  }

  gerarDataSource(dataSource: infoHistoricoAtendiementos[], x: number) {
    let copyDataSource = JSON.parse(JSON.stringify(dataSource)); // Faz uma cópia profunda do array
    copyDataSource = copyDataSource.map((item: any) => {
      item.tempoMedioAtendimento = this.substituirNumeroTempoPorAleatorio(item.tempoMedioAtendimento);
      item.tempoMedioEspera = this.substituirNumeroTempoPorAleatorio(item.tempoMedioEspera);
      item.totalAtendimentos = x * item.totalAtendimentos;
      return item;
    })
    return copyDataSource;
  }

  substituirNumeroTempoPorAleatorio(str: string): string {
    const numeroAtual = str.match(/\d+/)?.[0]; // Ex: "7" em "7 min"
    if (!numeroAtual) return str; // Se não houver número, retorna original
    const novoNumero = Math.floor(Math.random() * 60) + 1;
    return str.replace(numeroAtual, novoNumero.toString());
  }

  removerColunas() {
    this.displayedColumns = this.displayedColumns.filter((coluna) => coluna !== 'totalAtendimentos')
      .filter((coluna) => coluna !== 'tempoMedioEspera');

    this.data.forEach(item => {
      item.displayedColumns = [...this.displayedColumns];
    });
  }
}
