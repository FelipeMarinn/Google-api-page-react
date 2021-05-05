import {Component} from 'react'
import image from './icons/0.png'

export default class Nearby extends Component {

    constructor(props) {
        super(props) 
        this.state = {
            show: false,
            buttonState: false
        }
    }

    buscarCercanos = () => {  
        this.google = window.google
        const mapCenter = this.props.coordenadas
        this.map = new this.google.maps.Map(document.getElementById('placesContent'), {
            center: mapCenter,
            zoom: 15
        })   
        const request = {
            location: mapCenter,
            radius: 5000,
            fields: ['photos', 'formatted_address', 'name','place_id'],
        };
        this.service = new this.google.maps.places.PlacesService(this.map);
        this.service.nearbySearch(request, this.findPlaceResult);
    }

    findPlaceResult = (results, status) => {
        console.log(results)
        if (status === 'OK') {
            let placePhoto = []
            let htmlContent = ['']
            for (let i = 1; i < results.length; i++) {
                let place = results[i]

                placePhoto[i] = place.photos ?  
                results[i].photos[0].getUrl({'maxWidth': 640, 'maxHeight': 420}) : image

                if (i <= 8 && !this.state.show) {
                    htmlContent[i] = <div key={i} className='nearby rounded col-6 col-sm-4 col-lg-3 p-0' onClick={(e) => this.marcador(e, place)}>
                                       <div className='nearby-image'><img src={placePhoto[i]} width='100%'/></div>
                                       <div className='text-content'>
                                         <div className='place-name'>{place.name}</div>
                                         <div className='rating'>{place.rating}</div>
                                       </div>
                                     </div>
                } else if (this.state.show) {
                    htmlContent[i] = <div key={i} className='nearby rounded col-6 col-sm-4 col-lg-3 p-0' onClick={(e) => this.marcador(e, place)}>
                                       <div className='nearby-image'><img src={placePhoto[i]} width='100%'/></div>
                                       <div className='text-content'>
                                         <div className='place-name'>{place.name}</div>
                                         <div className='rating'>{place.rating}</div>
                                       </div>
                                     </div>
                }
            }
            this.setState({
                nearbyPlaces: htmlContent,
                buttonState: true,
            })
        }
    }

    showMore = (e) => {
        if (e.target.id === 'mas') {
            this.setState({show: true})
            this.buscarCercanos()
        } else {
            this.setState({show: false})
            this.buscarCercanos()
        }   
    }

    marcador = (e, place) => {
        this.props.select(place.name)
    }

    render() {
        const button = this.state.show ? 'Mostrar menos' : 'Mostrar mas'
        const buttonId =  this.state.show ? 'menos' : 'mas'
        const buttonState = this.state.buttonState ? 'd-block' : 'd-none'

        return (
            <div className='nearby-content scroll container m-0 mt-2'>
              <button className='col-8 btn search-nearby' onClick={this.buscarCercanos}> Buscar lugares cercanos </button>
              <div id='nearby-box' className='row'>{this.state.nearbyPlaces}</div>
              <div className='row mt-2 p-0 m-0'>
                  <div className='col-12'>
                    <a className={`link ${buttonState}`} role='btn' id={buttonId} onClick={this.showMore}>{button}</a>
                  </div>  
              </div>
            </div>
        )
        
    }
}