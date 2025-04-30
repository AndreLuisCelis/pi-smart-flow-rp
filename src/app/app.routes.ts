import { Routes } from '@angular/router';
import { MonitoramentoComponent } from './monitoramento/monitoramento.component';
import { HistoricoComponent } from './historico/historico.component';
import { RecomendacoesComponent } from './recomendacoes/recomendacoes.component';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        component: RecomendacoesComponent,
    },
    {
        path: 'historico',
        component: HistoricoComponent,
    },
    {
        path: 'monitoramento',
        component: MonitoramentoComponent,
    }
];
