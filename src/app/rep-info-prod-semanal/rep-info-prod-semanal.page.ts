import { ChangeDetectorRef, Component, OnInit,  ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, BarController, LinearScale, CategoryScale, BarElement, LineController, PointElement, LineElement, Legend, Tooltip, Title} from 'chart.js';
import { registerables, ChartData, ChartTypeRegistry } from 'chart.js';
import { ReportesService } from '../services/reportes.service';
import { LotesService } from '../services/lotes.service';
import { GalponService } from '../services/galpon.service';
import { GranjaService } from '../services/granja.service';
import { ClienteService } from '../services/cliente.service';
import { AuthService } from '../services/auth.service';
import { RolesService } from '../services/roles.service';
import { PlantaService } from '../services/planta.service';
import { Rol } from '../interfaces/rol';
import { Planta } from '../interfaces/planta';
Chart.register(BarController, LinearScale, CategoryScale, BarElement, 
  LineController, PointElement, LineElement, Legend, Tooltip, Title);


@Component({
  selector: 'app-rep-info-prod-semanal',
  templateUrl: './rep-info-prod-semanal.page.html',
  styleUrls: ['./rep-info-prod-semanal.page.scss'],
})
export class RepInfoProdSemanalPage implements OnInit {

  @ViewChild('myChart') myChart: ElementRef;
  @ViewChild('myChart1') myChart1: ElementRef;


  private chartDesempProd: Chart;
  private chartMortSel: Chart;
  private chartDesempHist: Chart;
  private chartDesempHistS1: Chart;
  private chartDesempHistS2: Chart;
  private chartDesempHistS3: Chart;
  private chartDesempHistS4: Chart;
  private chartDesempHistS5: Chart;
  private chartDesempHistS6: Chart;
  private chartDesempHistS7: Chart;
  private chartDesempHistS8: Chart;

  idClienteSeleccionado: number | null = null;
  idGranjaSeleccionada: number | null = null;
  idGalponSeleccionado: number | null = null;
  idLoteSeleccionado: number | null = null;
  listaClientes:any=[];
  listaGranjas:any=[];
  listaGalpones:any[];
  listaLotes:any[];
  listaRepDesProd: any[] = [];
  listaRepMortSelAct: any[] = [];
  listaRepDesVsGuia: any[] = [];
  listaRepDesVsHist: any[] = [];
  listaTemp:any[]=[];

  constructor(
    private _chRef: ChangeDetectorRef,
    private _auth:AuthService,
    private _clienteService:ClienteService,
    private _granjaService:GranjaService,
    private _galponService:GalponService,
    private _loteService:LotesService,
    private _reportesService: ReportesService,
    private _plantaService:PlantaService,
    private _rolService: RolesService,
  ) { }

  ngOnInit() {
    this.getListClientes();
  }

  ChartDesempProdActual() {
      // Si el gráfico ya existe, lo destruye antes de crear uno nuevo
  if (this.chartDesempProd) {
    this.chartDesempProd.destroy();
  }
    const labels = this.listaRepDesProd.map(report => 'SEM' + ' '+ (report.edadDias / 7));
    const pesoPromedioData = this.listaRepDesProd.map(report => report.pesoPromedio);
    const consumoAcumuladoData = this.listaRepDesProd.map(report => report.consumoAcumulado);
    const conversionAnimalData = this.listaRepDesProd.map(report => report.conversionAnimal);


    this.chartDesempProd = new Chart(this.myChart.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Peso Promedio (g)',
            data: pesoPromedioData,
            backgroundColor: 'rgba(79, 129, 189, 0.4)',
            borderColor: 'rgba(79, 129, 189, 1)',
            borderWidth: 1
          },
          {
            label: 'Consumo Acumulado (g)',
            data: consumoAcumuladoData,
            backgroundColor: 'rgba(192, 80, 77, 0.4)',
            borderColor: 'rgba(192, 80, 77, 1)',
            borderWidth: 1
          },
          {
            type: 'line', // Especificamos que este dataset es de tipo 'line'
            label: 'Conversión Alimenticia',
            data: conversionAnimalData,
            borderColor: 'rgba(154, 186, 91, 1)',
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: false,  // Esto asegura que el área bajo la línea no esté coloreada
            yAxisID: 'y-axis-2' // Establecemos un ID para el eje Y adicional
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'DESEMPEÑO PRODUCTIVO ACTUAL',
          }
        },
        responsive:true,
        scales: {
          y: {
            beginAtZero: true
          },
          'y-axis-2': {   // Agregamos la configuración para el eje Y adicional
            position: 'right',
            beginAtZero: true
          }
        },
      }
    });
  }

  ChartMortSelActual(){
    // Si el gráfico ya existe, lo destruye antes de crear uno nuevo
  if (this.chartMortSel) {this.chartMortSel.destroy();}

  const labels = this.listaRepDesProd.map(report => 'SEM' + ' '+ (report.edadDias / 7));
  const mortalidadPorcData = this.listaRepMortSelAct.map(report => report.mortalidadPorc * 100);
  const seleccionPorcData = this.listaRepMortSelAct.map(report => report.seleccionPorc * 100);
  const mortalidadMasSeleccionData = this.listaRepMortSelAct.map(report => report.mortalidadMasSeleccion * 100);

  this.chartMortSel = new Chart(this.myChart1.nativeElement, {
  type: 'bar',
  data: {
  labels: labels,
  datasets: [
    {
      label: '% Mortalidad',
      data: mortalidadPorcData,
      backgroundColor: 'rgba(79, 129, 189, 0.4)',
      borderColor: 'rgba(79, 129, 189, 1)',
      borderWidth: 1
    },
    {
      label: '% Seleccion',
      data: seleccionPorcData,
      backgroundColor: 'rgba(192, 80, 77, 0.4)',
      borderColor: 'rgba(192, 80, 77, 1)',
      borderWidth: 1
    },
    {
      label: '% Mort + % Selec',
      data: mortalidadMasSeleccionData,
      backgroundColor: 'rgba(154, 186, 91, 0.4)',
      borderColor: 'rgba(154, 186, 91, 1)',
      borderWidth: 1
    },
  ]
  },
  options: {
  plugins: {
    title: {
      display: true,
      text: 'MORTALIDAD Y SELECCION ACTUAL',
    }
  },
  responsive:true,
  scales: {
    y: {
      beginAtZero: true
    },
  },
  }
});

}

ChartDesempProdActualvsHistoricos() {
  this.createChartForWeek("SEMANA 1", 'chartDesempHistS1', 'DESEMPEÑO SEMANA 1');
  this.createChartForWeek("SEMANA 2", 'chartDesempHistS2', 'DESEMPEÑO SEMANA 2');
  this.createChartForWeek("SEMANA 3", 'chartDesempHistS3', 'DESEMPEÑO SEMANA 3');
  this.createChartForWeek("SEMANA 4", 'chartDesempHistS4', 'DESEMPEÑO SEMANA 4');
  this.createChartForWeek("SEMANA 5", 'chartDesempHistS5', 'DESEMPEÑO SEMANA 5');
  this.createChartForWeek("SEMANA 6", 'chartDesempHistS6', 'DESEMPEÑO SEMANA 6');
  this.createChartForWeek("SEMANA 7", 'chartDesempHistS7', 'DESEMPEÑO SEMANA 7');
  this.createChartForWeek("SEMANA 8", 'chartDesempHistS8', 'DESEMPEÑO SEMANA 8');
}


  createChartForWeek(semana: string, canvasId: string, titulo: string) {
    const chartData = this.getChartDataForWeek(semana);

    if (this[canvasId] && this[canvasId].destroy) {
      this[canvasId].destroy();
    } 

    const newChart = new Chart(canvasId, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: titulo
            }
        },
        scales: {
          y: {
            beginAtZero: true
          },
          'y-axis-2': {
            position: 'right',
            beginAtZero: true
          }
        }
      }
    });

    this[canvasId] = newChart;
}


  getChartDataForWeek(semana: string): ChartData<'bar' | 'line', number[], string> {
    const filteredData = this.listaRepDesVsHist.filter(item => item.semanaSeguimiento === semana);
    const labels = filteredData.map(item => item.nombreLote);
    const pesoPromedio = filteredData.map(item => item.pesoPromedio);
    const consumoAcumulado = filteredData.map(item => item.consumoAcumulado);
    const conversionAnimal = filteredData.map(item => item.conversionAnimal);

    return {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: 'Peso Promedio (g)',
          data: pesoPromedio,
          backgroundColor: 'rgba(79, 129, 189, 0.4)',
          borderColor: 'rgba(79, 129, 189, 1)',
          borderWidth: 1
        },
        {
          type: 'bar',
          label: 'Consumo Acumulado (g)',
          data: consumoAcumulado,
          backgroundColor: 'rgba(192, 80, 77, 0.4)',
          borderColor: 'rgba(192, 80, 77, 1)',
          borderWidth: 1
        },
        {
          type: 'line',
          label: 'Conversión Alimenticia',
          data: conversionAnimal,
          borderColor: 'rgba(154, 186, 91, 1)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false,  // Esto asegura que el área bajo la línea no esté coloreada
          yAxisID: 'y-axis-2' // Estable
        }
      ]
    };
  }


  async obtenerRoles(): Promise<Rol[]> {
    return new Promise((resolve, reject) => {
      this._rolService.getListaRoles().subscribe((data: any) => {
        if (data.error) {
          console.error(data.message);
          reject(data.message);
        } else {
          resolve(data.result as Rol[]); 
        }
      });
    });
  }
  
async obtenerPlantaPorUsuario(idUsuario: number): Promise<Planta> {
  return new Promise((resolve, reject) => {
    this._plantaService.GetPlantaByIdUser(idUsuario).subscribe((dataPlanta: any) => {
      if (dataPlanta.error) {
        console.error(`Error:${dataPlanta.message} - code: ${dataPlanta.codError} - ${dataPlanta.result}`);
        reject(dataPlanta.message);
      } else {
        resolve(dataPlanta.result as Planta);
      }
    });
  });
}

  async getListClientes() {
  const usuarioActual = this._auth.getUser();
  try {
    const listaRoles = await this.obtenerRoles();
    const nombre_rol = listaRoles.find(rol => rol.id === usuarioActual.Rol);
    usuarioActual.RolText = nombre_rol.nombre;
    const planta = await this.obtenerPlantaPorUsuario(usuarioActual.Id);
    if (planta && planta.nombre) {
      usuarioActual.Planta = planta.id;
      console.log(planta);
    } else {
      console.error('El resultado no tiene una propiedad nombre válida.');
    }
    this._clienteService.getListaClientes().subscribe((dataClientes: any) => {
      if (dataClientes.error) {
        console.error(dataClientes.message);
      } else {
        this.listaTemp = dataClientes.result;
        if (usuarioActual.RolText === 'Administrador') {
          this.listaClientes = this.listaTemp;
        } else {
          this.listaClientes = this.listaTemp.filter(cliente =>
            cliente.idPlantas.some(planta => planta.id === usuarioActual.Planta)
          );
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}

getGranjas(event:any){
  this.idClienteSeleccionado = event.detail.value;
  console.log(this.idClienteSeleccionado)
  this._granjaService.getGranjaByIdCliente(this.idClienteSeleccionado).subscribe((data:any)=>{
    if (data.error){
      console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
    }else{
      this.listaGranjas = data.result;
      console.log(this.listaGranjas)
      this._chRef.detectChanges();
    }
  })
}

getGalpones(event:any){
  this.idGranjaSeleccionada = event.detail.value;
  console.log(this.idGranjaSeleccionada)
  this._galponService.getGalponByIdGranja(this.idGranjaSeleccionada).subscribe((data:any)=>{
    if (data.error){
      console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
    }else{
      this.listaGalpones = data.result;
      console.log(this.listaGalpones)
      this._chRef.detectChanges();
    }
  })
}

getLotes(event:any){
  this.idGalponSeleccionado = event.detail.value;
  console.log(this.idGalponSeleccionado)
  this._loteService.getLoteByIdGalpon(this.idGalponSeleccionado).subscribe((data:any)=>{
    if (data.error){
      console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
    }else{
      this.listaLotes = data.result;
      
      console.log(this.listaLotes)
      this._chRef.detectChanges();
    }
  })
}

seleccionarLote(event: any) {
  this.idLoteSeleccionado = event.detail.value;
  console.log(this.idLoteSeleccionado)
  this.GetListaReporteDesProd();
  this.GetListaReporteMortSelActual();
  this.GetListaReporteDesVsGuia();
  this.GetListaReporteDesActVsHist();
}

GetListaReporteDesProd() {
  if (this.idClienteSeleccionado && this.idGranjaSeleccionada && this.idGalponSeleccionado && this.idLoteSeleccionado) {
    this._reportesService.getReporteDesempenoProductivoActual(
      this.idClienteSeleccionado, 
      this.idGranjaSeleccionada, 
      this.idGalponSeleccionado, 
      this.idLoteSeleccionado
    )
    .subscribe((data: any) => {
      if (data.error) {
        console.error(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
      } else {
        this.listaRepDesProd = data.result;
        this.ChartDesempProdActual();
      }
    }, error => {
      console.error("Error al obtener reporte:", error);
    });
  } else {
    console.error("Faltan datos para generar el reporte.");
  }
}

GetListaReporteMortSelActual() {
  if (this.idClienteSeleccionado && this.idGranjaSeleccionada && this.idGalponSeleccionado && this.idLoteSeleccionado) {
    this._reportesService.getReporteMortalidadSeleccionAct(
      this.idClienteSeleccionado, 
      this.idGranjaSeleccionada, 
      this.idGalponSeleccionado, 
      this.idLoteSeleccionado
    )
    .subscribe((data: any) => {
      if (data.error) {
        console.error(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
      } else {
        this.listaRepMortSelAct = data.result;
        this.ChartMortSelActual();
      }
    }, error => {
      console.error("Error al obtener reporte:", error);
    });
  } else {
    console.error("Faltan datos para generar el reporte.");
  }
}

GetListaReporteDesVsGuia(){
  if (this.idClienteSeleccionado && this.idGranjaSeleccionada && this.idGalponSeleccionado && this.idLoteSeleccionado) {
    this._reportesService.getReporteDesempenoProductivoVsGuia(
      this.idClienteSeleccionado, 
      this.idGranjaSeleccionada, 
      this.idGalponSeleccionado, 
      this.idLoteSeleccionado
    )
    .subscribe((data: any) => {
      if (data.error) {
        console.error(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
      } else {
        this.listaRepDesVsGuia = data.result;
        // console.log(this.listaRepDesVsGuia);
      }
    }, error => {
      console.error("Error al obtener reporte:", error);
    });
  } else {
    console.error("Faltan datos para generar el reporte.");
  }
}

GetListaReporteDesActVsHist(){
  if (this.idClienteSeleccionado && this.idGranjaSeleccionada && this.idGalponSeleccionado && this.idLoteSeleccionado) {
    this._reportesService.getReporteDesempenoActualVSHistoricos(
      this.idClienteSeleccionado, 
      this.idGranjaSeleccionada,  
      this.idLoteSeleccionado
    )
    .subscribe((data: any) => {
      if (data.error) {
        console.error(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
      } else {
        this.listaRepDesVsHist = data.result;
        console.log(this.listaRepDesVsHist);
        this.ChartDesempProdActualvsHistoricos();
      }
    }, error => {
      console.error("Error al obtener reporte:", error);
    });
  } else {
    console.error("Faltan datos para generar el reporte.");
  }
}


}
