import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wine } from '../..//models/wine.model';

declare var L: any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnChanges {
  latitude: number | undefined;
  longitude: number | undefined;
  @Input() mainWine: Wine | null = null;
  @Input() nearbyWines: Wine[] = [];
  @Input() initialLat: number = 47.3769; // Default to Zurich
  @Input() initialLon: number = 8.5417;
  @Input() initialZoom: number = 8;

  @Output() mapBoundsChange = new EventEmitter<any>();

  private map: any;
  private markersLayer = L.layerGroup();

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialLat'] || changes['initialLon']) {
      this.latitude = this.initialLat;
      this.longitude = this.initialLon;
    }
    if (this.map && (changes['mainWine'] || changes['nearbyWines'])) {
      this.updateMarkers();
    }
  }

  private initMap(): void {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([this.initialLat, this.initialLon], this.initialZoom);
    this.markersLayer.addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('moveend', () => {
      this.mapBoundsChange.emit(this.map.getBounds());
    });

    this.updateMarkers();
  }

  private updateMarkers(): void {
    this.markersLayer.clearLayers();

    // Add nearby wines first
    this.nearbyWines.forEach(wine => {
      if (wine.location && wine._id !== this.mainWine?._id) {
        const coords = wine.location.coordinates;
        L.marker([coords[1], coords[0]])
          .bindPopup(`<b>${wine.name}</b><br>${wine.winery}`)
          .addTo(this.markersLayer);
      }
    });

    // Add the main wine with a special marker
    if (this.mainWine?.location) {
      const coords = this.mainWine.location.coordinates;
      const mainMarkerIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41]
      });

      L.marker([coords[1], coords[0]], { icon: mainMarkerIcon })
        .bindPopup(`<b>${this.mainWine.name}</b><br>This is the selected wine.`)
        .addTo(this.markersLayer)
        .openPopup();

      // Center map on main wine
      this.map.setView([coords[1], coords[0]], this.initialZoom);
    }
  }
}
