import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, SearchbarCustomEvent } from '@ionic/angular';

@Component({
  standalone:true,
  imports:[IonicModule,CommonModule,FormsModule,ReactiveFormsModule],
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting:forwardRef(()=>SerclableSelectComponent),
    multi:true
  }],
  selector: 'app-serclable-select',
  templateUrl: './serclable-select.component.html',
  styleUrls: ['./serclable-select.component.scss'],
})
export class SerclableSelectComponent implements OnChanges, ControlValueAccessor {
  @Input() title:string = "Search";
  @Input() data!:any[];
  @Input() multiple:boolean = false;
  @Input() itemTextField:string = 'name';

  isOpen:boolean = false;
  selected:any [] = [];
  filtered:any = [];


  @Output() selectedChanged:EventEmitter<any> = new EventEmitter();
  constructor() { }
  onChange: any = () => {}
  onTouch: any = () => {}

  onWillDismiss(event:any){
    this.isOpen = false;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  // d) copy paste this code
  writeValue(input: any[]) {
    //debuger;
    const selected = this.data.filter((item)=> item.selected || item.selected == input);
    if(selected.length > 0){
      this.selected[0].selected = selected;
      this.selectedChanged.emit(this.selected);
    }
  }

  ngOnChanges(changes:SimpleChanges):void{
    this.filtered = this.data;
    this.itemSelected();
  }

  open(){
    this.filtered = this.data;
    this.isOpen = true;
  }

  cancel(){
    this.isOpen = false;
  }

  select(){
    const selected = this.data.filter((item)=> item.selected);
    this.selected = selected;
    this.selectedChanged.emit(selected);
    this.isOpen = false;
  }

  itemSelected(){
    //debuger;
    if(!this.multiple){
      if(this.selected.length){
        this.selected[0].selected = false
      }
      this.selected = this.data.filter((item)=>item.selected);
      if(this.selected.length > 0){
        this.selectedChanged.emit(this.selected);
      }
      this.isOpen = false;
    }
  }

  filter(event:SearchbarCustomEvent){
    const filter = event.detail.value?.toLocaleLowerCase();
    this.filtered = this.data.filter((item:any) => this.leaf(item).toLowerCase().indexOf(filter) >=0);
  }

  leaf = (obj:any) => this.itemTextField.split('.').reduce((value,el)=>value[el],obj);
}


