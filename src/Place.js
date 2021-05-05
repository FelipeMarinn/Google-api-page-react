import React, { Component } from 'react'
import image from './icons/0.png'

export default class Place extends Component {

  render() {
    let cantPhotos = this.props.placeData.photos.length;
    if (cantPhotos > 6)
      cantPhotos = 6;
    else
      cantPhotos = 3;
    const colSize = 4
    let  htmlPhotos=[];
    
    this.props.placeData.photos.map((photo, index) => {    
      if (photo) {
        htmlPhotos.push(
          <div key={index} className={'col-4 col-md-6'+colSize+' text-center place-image'}>
            <img src={photo} alt={this.props.placeData.name}/>
          </div>);
      } else {
        htmlPhotos.push(
         <div key={index} className={'col-12 text-center place-image'}>
            <img src={image} alt={this.props.placeData.name}/>
         </div>);
      }
      // if (index === (cantPhotos-1)) return
    })

    return (
      <div className='place p-0'>
        <div className='row py-2'>
          {htmlPhotos.slice(0,3)} 
        </div>
        <div className='row py-2'>
          {htmlPhotos.slice(3,6)} 
        </div>
        <div className='row'> 
          <div className='col text-center'>{this.props.placeData.address}</div>
        </div>
        <div className='row'> 
          <div className='col text-center'>{this.props.placeData.Horario}</div>
        </div>
      </div>
    )
  }
}
