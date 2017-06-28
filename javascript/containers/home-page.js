import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {getShipments} from 'shipments'

const HomePage = class extends React.Component {
  componentDidMount = () => {
    this.props.getShipments()
  }

  render () {
    // const datasourceCards = this.props.datasources.map((ds, i) => {
    //   return (<div key={i} className='paper square square-list'>
    //     <Link to={`/datasource/${ds.id}`} className='full-link'>
    //       {ds.name}
    //     </Link>
    //   </div>)
    // })
    return (
      <div className='home-page'>
        {this.props.loading ? (
          <div className='loading-indicator'>
            <div className='loader' />
            <p>Loading datasources...</p>
          </div>
        ) : (
          <div>
            {/* <Header>Datasources</Header> */}
            Shipments
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  state => state.shipments,
  { getShipments }
)(HomePage)
