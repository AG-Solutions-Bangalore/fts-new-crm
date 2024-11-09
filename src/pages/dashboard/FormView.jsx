import React from 'react'
import Layout from '../../layout/Layout'
import { Link } from 'react-router-dom'

const FormView = () => {
  return (
  <Layout>
      <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
        <Link target='_blank' className='cursor-pointer' to={'https://app.eraser.io/workspace/4z2u5pIqk2EEkL9bXCGS?origin=share'}>
    
          <h1 className="border-b-2  font-[400] border-dashed border-orange-800">Form View Link (clickme)</h1>
          </Link>
        </div>
  </Layout>
  )
}

export default FormView