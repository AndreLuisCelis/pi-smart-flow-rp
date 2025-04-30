import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

interface Monitoramento {
  especialidade: string;
  quantidadeEmEspera: number;
}

@Component({
  selector: 'app-monitoramento',
  standalone: true,
  imports: [CommonModule ,MatCardModule ],
  styleUrls: ['./monitoramento.component.css'],
  templateUrl: './monitoramento.component.html',
})
export class MonitoramentoComponent {

  listaMonitoramento: Monitoramento[] = [
    { especialidade: 'Cardiologia', quantidadeEmEspera: 15 },
    { especialidade: 'Pediatria', quantidadeEmEspera: 3 },
    { especialidade: 'Dermatologia', quantidadeEmEspera: 18 },
    { especialidade: 'Oftalmologia', quantidadeEmEspera: 2 },
    { especialidade: 'Ortopedia', quantidadeEmEspera: 4 },
    { especialidade: 'Ginecologia', quantidadeEmEspera: 6 },
    { especialidade: 'Neurologia', quantidadeEmEspera: 11 },
    { especialidade: 'Psiquiatria', quantidadeEmEspera: 7 },
    { especialidade: 'Endocrinologia', quantidadeEmEspera: 2 },
  ];
  private updateInterval: any;
  startUpdatingMonitoramento(): void {
    setInterval(() => {
      let hasChanged = false;
      this.listaMonitoramento = this.listaMonitoramento.map(monitoramento => {
        const change = Math.floor(Math.random() * 4); // Random value: 0, 1, 2, or 3
        const increment = Math.random() < 0.5; // Randomly decide to increment or decrement
        const updatedMonitoramento = {
          ...monitoramento,
          quantidadeEmEspera: Math.max(
            0,
            monitoramento.quantidadeEmEspera + (increment ? change : -change)
          ),
        };

        if (updatedMonitoramento.quantidadeEmEspera !== monitoramento.quantidadeEmEspera) {
          hasChanged = true;
        }

        return updatedMonitoramento;
      });

      if (hasChanged) {
        this.applyPulseEffect();
      }
    }, 5500); // 5.5 seconds
  }

  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    this.startUpdatingMonitoramento();
  }

  applyPulseEffect(): void {
    this.cdr.detectChanges(); 
    const cardElements = document.querySelectorAll('.info-numerica');
    cardElements.forEach(cardElement => {
      cardElement.classList.add('sinalizar-alteracao');
      setTimeout(() => cardElement.classList.remove('sinalizar-alteracao'), 500); // Remove the class after 1 second
    });
  }
  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }      
  }
}