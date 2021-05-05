import React, { Component } from 'react'
import '../node_modules/font-awesome/css/font-awesome.css'

export default class Rating extends Component {

  constructor() {
    super()
    this.state = {show: false}
  }
  
  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius,color) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;
    ctx.strokeSyle = "#000";
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius)
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y)
        rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath();
    ctx.lineWidth=2;
    ctx.strokeStyle='goldenrod';
    ctx.stroke();
    ctx.fillStyle=color;
    ctx.fill();
  }

  componentDidMount() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 150;
    canvas.height = 30;
    const initx=15;
    const stepPos = 30;
    const completeStar = Math.floor(this.props.placeRating);
    const partialStar = (this.props.placeRating - completeStar).toFixed(1);
    for (let index = 0; index < completeStar; index++) {
        this.drawStar(ctx, initx+(stepPos*index), 12, 5, 10, 4.5,'gold');
    }
    const partialFill = this.props.placeRating - completeStar
    if (partialFill > 0){
      var gradient = ctx.createLinearGradient(125.48943483704846,2,144.51056516295154,2);
      gradient.addColorStop(0, 'gold');
      gradient.addColorStop(partialStar, 'gold');
      gradient.addColorStop(partialStar, 'white');
      gradient.addColorStop(1, 'white');
      this.drawStar(ctx, initx+(stepPos*completeStar), 12, 5, 10, 4.5,gradient);
    }
  }

  componentDidUpdate() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 150;
    canvas.height = 30;
    const initx=15;
    const stepPos = 30;
    const completeStar = Math.floor(this.props.placeRating);
    const partialStar = (this.props.placeRating - completeStar).toFixed(1);
    for (let index = 0; index < completeStar; index++) {
        this.drawStar(ctx, initx+(stepPos*index), 12, 5, 10, 4.5,'gold');
    }
    const partialFill = this.props.placeRating - completeStar
    if (partialFill > 0){
      var gradient = ctx.createLinearGradient(125.48943483704846,2,144.51056516295154,2);
      gradient.addColorStop(0, 'gold');
      gradient.addColorStop(partialStar, 'gold');
      gradient.addColorStop(partialStar, 'white');
      gradient.addColorStop(1, 'white');
      this.drawStar(ctx, initx+(stepPos*completeStar), 12, 5, 10, 4.5,gradient);
    }
  }

  show = () => {
    this.setState({show: !this.state.show})
  }

  render() {
    const {show} = this.state
    let coments = []
    this.props.placeReviews.map( (e, index) => {
      let estrellas = []
      for (let index = 0; index < e.rating; index++) {
        estrellas[index] = <span className='fa fa-star'></span>;
      }
      let text = e.text ? e.text : '...Sin comentario' 
      coments[index] =  <div key={index} className={'row '+(show ? 'd-block' : 'd-none')}> 
                          <div className='col'><strong>{e.author_name}</strong></div>
                          <div className='col'>{estrellas}</div>
                          <div className='col'>{text}</div>
                        </div>         
    })
    return (
      <div className='p-0 pb-md-4 mt-md-4 coments'>
        <div className='row mb-1'>
          <div className='col-4 showButton'>
            <strong className='showButton' onClick={this.show}>Comentarios:</strong>
          </div>
          <div className='col-12 col-md-auto'><strong>Rating:</strong></div>
          <div className='col-auto'>{this.props.placeRating}</div>
          <div className='col-auto p-0'>
            <canvas id='canvas'></canvas>
          </div>
        </div>
        {coments}
      </div>
    )
  }
}
