import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import searchIcon from './icons/search-solid.svg'
import './css/App.css'
import Map from './Map';
import Place from './Place';
import Rating from './Rating';
import Horario from './Horario';
import Nearby from './Nearby';


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {photo:''}
    this.map = ''
  }

  componentDidMount(){
    const googlePlaceAPILoad = setInterval(() => {
      if (window.google){
        this.google = window.google;
        console.log(this.google)
        console.log('cargo api')
        clearInterval(googlePlaceAPILoad);
        const mapCenter = new this.google.maps.LatLng(4.624335,-74.064644);
        this.map = new this.google.maps.Map(document.getElementById('placesContent'), {
          center: mapCenter,
          zoom: 15
        });
        this.showMap(mapCenter)
      };
    },100);
  }   

  showMap(mapCenter) {
    const showMap = <Map coordenadas={mapCenter}/>
    this.setState({
      map: showMap
    })
  }

  buscar = () => {
    const request = {
      query: document.getElementById('searchPlace').value,
      fields: ['photos', 'formatted_address', 'name','place_id'],
    };
    this.service = new this.google.maps.places.PlacesService(this.map)
    this.service.findPlaceFromQuery(request, this.findPlaceResult)
  }

  select = (name) => {
    const request = {
      query: name,
      fields: ['photos', 'formatted_address', 'name','place_id'],
    };
    this.service = new this.google.maps.places.PlacesService(this.map)
    this.service.findPlaceFromQuery(request, this.findPlaceResult)
  }

  findPlaceResult = (results, status) => {
    console.log(results)
    let arrPlace = []
    let placeId = ''
    if (status ===  'OK') {
      results.map(place => {
        const placeData = {
          id: place.place_id, 
          name: place.name,
          address: place.formatted_address,
          photos: place.photos
        }
        placeId = place.place_id;
        arrPlace.push(<Place placeData={placeData}/>)
      })
    }
    if (arrPlace.length > 0)
      this.findPlaceDetail(placeId)
    else {
      const placeData = {
        id: 'N/A', 
        name: <div className='mt-5'>
               <strong className='text-center'>No hay resultados</strong>
              </div>,
        address: '',
        photos: ['']
      }
      arrPlace.push(<Place placeData={placeData}/>)
      this.setState({places: arrPlace})
    }
  }

  findPlaceDetail = (id) => {
    var request = {
      placeId: id,
      fields: ['name', 'photo', 'formatted_address', 'rating', 'opening_hours', 'review', 'geometry']
    };
    this.service.getDetails(request, this.foundPlaceDatail)
  }

  foundPlaceDatail = (place, status) => {
    if (status === 'OK'){  
      console.log(place)
      let placePhotos = [''] 
      if (place.photos) {
        place.photos.map((placePhoto, index) => {
          placePhotos[index] = placePhoto.getUrl({'maxWidth': 640, 'maxHeight': 420})
        })
      }
      const placeData = {
        id: place.place_id, 
        name: place.name,
        address: place.formatted_address,
        photos: placePhotos,
        horario: place.opening_hours
      }
      const arrPlace = <Place placeData={placeData}/>
      const placeHorarios = <Horario horarios={placeData.horario}/>
      let rating
      if (place.rating){
        rating = <Rating placeRating={place.rating} placeReviews={place.reviews}/>
      } else {
        rating = ''
      }
      const showMap = <Map coordenadas={place.geometry.location}/>
      const nearbyPlaces = <Nearby update={false} select={this.select} place={arrPlace} coordenadas={place.geometry.location}/> 
      this.setState({
        places: arrPlace,
        horarios: placeHorarios,
        comentarios: rating,
        nearby: nearbyPlaces,
        map: showMap
      })
    
    }
  }

  render() {

    return (
      <div className="App">
        <div id='placesContent'></div>
        <div id='container-place' className='mt-3 rounded scroll' >     
            <div className='col text-center py-2 main-input'>
              <input type='search' className='inputSearch' id='searchPlace' placeholder='Buscar lugar'/> 
              <button className='icon-color' onClick={this.buscar} id='searchIcon'>
                <img src={searchIcon} width='20'></img>
              </button>
            </div>
          <div className='container sub-container-place'>
            {this.state.places}
            {this.state.horarios}
            {this.state.comentarios}
          </div>
        </div>
        <div id='container-map' className=' m-0 p-0'>
          {this.state.map}
          {this.state.nearby}
        </div>
      </div>
    );
  }
}

export default App;
