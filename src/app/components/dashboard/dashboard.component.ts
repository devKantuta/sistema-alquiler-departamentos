import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  panels = [
    {
      title: 'Explore The World',
      imageUrl: '../../../assets/img/dep.jpg',

      title2: 'Reservas al 7347388 ó 3345789',
    },
    {
      title: 'Wild Forest',
      imageUrl: '../../../assets/img/dep0.jpg',
      title2: 'Reservas al 7347388 ó 3345789',
    },
    {
      title: 'Sunny Beach',
      imageUrl: '../../../assets/img/dep1.jpg',
      title2: 'Reservas al 7347388 ó 3345789',
    },
    {
      title: 'City on Winter',
      imageUrl: '../../../assets/img/dep2.jpg',
      title2: 'Reservas al 7347388 ó 3345789',
    },
    {
      title: 'Mountains - Clouds',
      imageUrl: '../../../assets/img/dep3.jpg',
      title2: 'Reservas al 7347388 ó 3345789',
    },
  ];

  // Índice del panel activo
  activePanelIndex: number = 0;

  // Función para cambiar el panel activo
  setActivePanel(index: number): void {
    this.activePanelIndex = index;
  }
}
