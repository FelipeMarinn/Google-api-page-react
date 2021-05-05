import {Component} from 'react'
import searchIcon from './icons/search-solid.svg'
import './css/App.css'


export default class Map extends Component {

    constructor() {
        super()
        this.markers = ['']
        this.map = ''
    }

    componentDidMount() {
        this.google = window.google
        this.map = new this.google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: this.props.coordenadas
        })
        new this.google.maps.Marker({
            position: this.props.coordenadas, 
            map: this.map
        })
        this.map.addListener( "click", (event) => {
            this.addMarker(event.latLng, this.map)  
            this.origin = event.latLng     
        })
        document.getElementById("mode").addEventListener("change", () => {
            this.startRoute();
          });
    }

    addMarker(location, map) {
        let marker
        if (this.markers.length <= 1) {
            this.setMap(map)
            marker = new this.google.maps.Marker({
                position: location,
                map: map,
            })
        } else {
            this.setMap(null)
            marker = new this.google.maps.Marker({
                position: location,
                map: map,
            });
            this.markers.pop() 
        }
        this.markers.push(marker)
    }

    setMap = (map) => {
        for (let i = 1; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    }

    startRoute = () => {
        const map = new this.google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: this.props.coordenadas
        })
        const directionsService = new this.google.maps.DirectionsService()
        const directionsRenderer = new this.google.maps.DirectionsRenderer({
            map,
            draggable: true
        })
        directionsRenderer.addListener("directions_changed", () => {
            this.computeTotalDistance(directionsRenderer.getDirections());
        })
    
        const selectedMode = document.getElementById("mode").value;
        const puntoPartida = document.getElementById('puntoPartida').value
        let origin = puntoPartida ? puntoPartida : this.origin
        const request = {
            origin: origin,
            destination: this.props.coordenadas,
            travelMode: this.google.maps.TravelMode[selectedMode],
            unitSystem: this.google.maps.DirectionsUnitSystem['METRIC'],
            provideRouteAlternatives: true
        } 
        directionsService.route(request, function (result, status) {  
            if (status === 'OK') {
                directionsRenderer.setMap(map)
                directionsRenderer.setDirections(result)
            } else {
                alert(
                    'Ha fallado la comunicación en el mapa a causa de: ' + status 
                    + 'Seleciona otro modo de viaje'
                );
            }
        })
        if (!this.origin) {
            new this.google.maps.Marker({
                position: this.props.coordenadas, 
                map: map
            })
        }
    }
  

    computeTotalDistance = (result) => {
        let total = 0;
        const myroute = result.routes[0];
    
        for (let i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
        }
        total = total / 1000;
        document.getElementById("total").innerHTML = total + " km";
    }

    componentDidUpdate() {
        this.map = new this.google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: this.props.coordenadas
        })
        new this.google.maps.Marker({
            position: this.props.coordenadas, 
            map: this.map
        })   
        this.map.addListener( "click", (event) => {
            this.addMarker(event.latLng, this.map)  
            this.origin = event.latLng       
        })
    }
 
    render() {
      
        return (
            <div id='box-map'>        
                  <div id='map' className='mt-2'></div> 
                  <div className='row options-input'>
                     <input className='inputSearch' id='puntoPartida' placeholder='ingrese una ubicación de origen'/>
                     <button onClick={this.startRoute} id='searchIcon'><img src={searchIcon} width='20'></img></button>
                     <select id="mode">
                       <option value="DRIVING">Driving</option>
                       <option value="WALKING">Walking</option>
                       <option value="BICYCLING">Bicycling</option>
                       <option value="TRANSIT">Transit</option>
                     </select>
                  </div>        
                  {/* <button id='iniciar_ruta' className={'btn btn-primary ' + button} onClick={this.startRoute}>Iniciar ruta</button>        */}
            </div>
        )  
    }
}