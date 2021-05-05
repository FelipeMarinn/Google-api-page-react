import React, { Component } from 'react'

export default class Horario extends Component {
  constructor(props){
    super(props);
    this.state = {
      mostrar: props.mostrarHorario
    }
  }

  manejoOnClick = (e) => {
    if (e.target.id='horario'){
      this.setState((prevState) => {
        return {mostrarHorario: !prevState.mostrarHorario}
      })
    }
  }

  render() {
    let horarios='';
    if (this.props.horarios) {
      const abierto = this.props.horarios.weekday_text.map((horario,index) => {
          return <div key={index} className='row'>
                   {horario}
                 </div>;
      })
      horarios = <div className='row'>
                   <div className='col-auto'>
                     <strong className='showButton' role='button' id='horario' onClick={this.manejoOnClick}>
                       Horario
                     </strong>
                   </div>
                   <div className={'col '+(this.state.mostrarHorario ? 'd-block' : 'd-none')}>{abierto}</div>
                 </div>
    } else
      horarios = <div className='row'>
                   <div className='col'>
                     <strong>Horario no disponible</strong>
                   </div>    
                 </div>;
    return (
      <div className='p-0 mt-2 mt-md-5 horario'>
          {horarios}
      </div>
    )
  }
}
