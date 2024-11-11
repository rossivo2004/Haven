import { OrderSession } from '@/src/components/OrderSession/OrderSession'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
      <OrderSession />
    </Suspense>
  )
}

export default page