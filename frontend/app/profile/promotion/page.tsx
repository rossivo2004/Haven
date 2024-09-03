import PromotionSession from '@/src/components/PromotionSession/PromotionSession'
import React, { Suspense } from 'react'

const page = () => {
    return (
        <Suspense>
            <PromotionSession />
        </Suspense>
    )
}

export default page