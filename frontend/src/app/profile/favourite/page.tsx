
import ProfileFavourite from '@/src/components/ProfileFavourite'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
      <ProfileFavourite />
    </Suspense>
  )
}

export default page