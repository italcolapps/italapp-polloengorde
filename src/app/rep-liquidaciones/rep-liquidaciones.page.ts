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
  selector: 'app-rep-liquidaciones',
  templateUrl: './rep-liquidaciones.page.html',
  styleUrls: ['./rep-liquidaciones.page.scss'],
})
export class RepLiquidacionesPage implements OnInit {
  @ViewChild('chartCanvas') chartCanvas: ElementRef;
  @ViewChild('barCanvas', { static: true }) barCanvas: ElementRef;
  private chartDesempLiq: any;
  private chartDesempHistLiq: any;

  idClienteSeleccionado: number | null = null;
  idGranjaSeleccionada: number | null = null;
  idGalponSeleccionado: number | null = null;
  idLoteSeleccionado: number | null = null;
  listaClientes:any=[];
  listaGranjas:any=[];
  listaGalpones:any[];
  listaLotes:any[];
  listaTemp:any[]=[];
  listaRepDesLiq: any[] = [];
  listaRepDesHistLiq: any[] = [];
  listaRepLiqDifGuia: any[] = [];

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
  

  ChartDesemProdLiq() {

    if (this.chartDesempLiq) {
      this.chartDesempLiq.destroy();
    }

    if (!this.listaRepDesLiq || this.listaRepDesLiq.length === 0) {
      console.error("listaRepDesLiq está vacío o no definido.");
      return;
    }
  
    const data = this.listaRepDesLiq[0];
    if (!data.pesoPromedio || !data.consumoAcumulado || !data.conversionAnimal) {
      console.error("Algunos datos necesarios no están presentes en listaRepDesLiq.");
      return;
    }
  
    this.chartDesempLiq = new Chart('chartCanvas', {
      type: 'bar',
      data: {
        labels: ['Peso (g)', 'Consumo Acum (g)', 'CA'],
        datasets: [
          {
            label: 'Valor Actual',
            data: [data.pesoPromedio, data.consumoAcumulado],
            backgroundColor: 'rgba(70, 114, 196, 0.6)',
            borderColor: 'rgba(70, 114, 196,, 1)',
            borderWidth: 1,
            yAxisID: 'y' // Asignar al eje Y principal
          },
          {
            label: 'Valor Guía',
            data: [data.pesoPromedioGuia, data.consumoAcumuladoGuia],
            backgroundColor: 'rgba(236, 125, 50, 0.6)',
            borderColor: 'rgba(236, 125, 50, 1)',
            borderWidth: 1,
            yAxisID: 'y' // Asignar al eje Y principal
          },
          {
            label: 'Valor CA',
            data: [null, null, data.conversionAnimal], // Solo asignar valor en el índice de FCA
            backgroundColor: 'rgba(70, 114, 196, 0.6)',
            borderColor: 'rgba(70, 114, 196,, 1)',
            borderWidth: 1,
            yAxisID: 'y-axis-2' // Asignar al eje Y adicional
          },
          {
            label: 'Valor CA Guía',
            data: [null, null, data.conversionAlimenticiaGuia], // Solo asignar valor en el índice de FCA
            backgroundColor: 'rgba(236, 125, 50, 0.6)',
            borderColor: 'rgba(236, 125, 50, 1)',
            borderWidth: 1,
            yAxisID: 'y-axis-2' // Asignar al eje Y adicional
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'DESEMPEÑO PRODUCTIVO',
          }
        },
        responsive:true,
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
  }

  ChartDesempProdHist() {
    const labels = this.listaRepDesHistLiq.map(item => item.nombreLote);
    const pesoPromedio = this.listaRepDesHistLiq.map(item => item.pesoPromedio);
    const consumoAcumulado = this.listaRepDesHistLiq.map(item => item.consumoAcumulado);
    const conversionAnimal = this.listaRepDesHistLiq.map(item => item.conversionAnimal);

    this.chartDesempHistLiq = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
            label: 'Peso Promedio (g)',
            data: pesoPromedio,
            backgroundColor: 'rgba(111, 173, 70, 0.6)',
            borderColor: 'rgba(111, 173, 70, 1)',
            borderWidth: 1
          },
          {
            label: 'Consumo Acum (g)',
            data: consumoAcumulado,
            backgroundColor: 'rgba(90, 155, 213, 0.6)',
            borderColor: 'rgba(90, 155, 213, 1)',
            borderWidth: 1
          },
          {
            label: 'Conversión Animal',
            data: conversionAnimal,
            type: 'line',
            fill: false,
            borderColor: 'rgba(246, 210, 89, 1)',
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            yAxisID: 'y-axis-2' // E
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'DESEMPEÑO HISTORICO',
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
        }
      }
    });
  }
  

    async obtenerRoles(): Promise<Rol[]> {
      return new Promise((resolve, reject) => {
        this._rolService.getListaRoles().subscribe((data: any) => {
          if (data.error) {
            console.error(data.message);
            reject(data.message);
          } else {
            resolve(data.result as Rol[]); // Esto asume que data.result es un array de tipo 'Rol'
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
          resolve(dataPlanta.result as Planta); // Esto asume que dataPlanta.result es de tipo 'Planta'
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
    this.GetListaReporteDesLiq();
    this.GetListaReporteDesHistLiq();
    this.GetListaReporteLiquidacionDifGuia();
  }

  GetListaReporteDesLiq(){
    if (this.idClienteSeleccionado && this.idGranjaSeleccionada && this.idGalponSeleccionado && this.idLoteSeleccionado) {
      this._reportesService.getReporteDesempenoProductivoLiquidacion(
        this.idClienteSeleccionado, 
        this.idGranjaSeleccionada, 
        this.idGalponSeleccionado, 
        this.idLoteSeleccionado
      )
      .subscribe((data: any) => {
        if (data.error) {
          console.error(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
        } else {
          this.listaRepDesLiq = data.result;
          this.ChartDesemProdLiq();
          
        }
      }, error => {
        console.error("Error al obtener reporte:", error);
      });
    } else {
      console.error("Faltan datos para generar el reporte.");
    }
  }

  GetListaReporteDesHistLiq(){
    if (this.idClienteSeleccionado && this.idGranjaSeleccionada && this.idGalponSeleccionado && this.idLoteSeleccionado) {
      this._reportesService.getReporteDesempenoHistoricoLiq(this.idClienteSeleccionado, this.idGranjaSeleccionada, )
      .subscribe((data: any) => {
        if (data.error) {
          console.error(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
        } else {
          this.listaRepDesHistLiq = data.result;
          this.ChartDesempProdHist();
          
        }
      }, error => {
        console.error("Error al obtener reporte:", error);
      });
    } else {
      console.error("Faltan datos para generar el reporte.");
    }
  }

  GetListaReporteLiquidacionDifGuia(){
    if (this.idClienteSeleccionado && this.idGranjaSeleccionada && this.idGalponSeleccionado && this.idLoteSeleccionado) {
      this._reportesService.getReporteLiquidacionDifGuia(
        this.idClienteSeleccionado, 
        this.idGranjaSeleccionada, 
        this.idGalponSeleccionado, 
        this.idLoteSeleccionado
      )
      .subscribe((data: any) => {
        if (data.error) {
          console.error(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
        } else {
          data.result.forEach(item => {
            item.mortalidadPorcen *= 100;
        });
          this.listaRepLiqDifGuia = data.result;
          console.log(this.listaRepLiqDifGuia);
          
        }
      }, error => {
        console.error("Error al obtener reporte:", error);
      });
    } else {
      console.error("Faltan datos para generar el reporte.");
    }
  }

  

}
