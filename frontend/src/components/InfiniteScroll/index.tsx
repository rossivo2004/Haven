import './style.css'
import Image from 'next/image';

function InfiniteScroll() {
    return (
        <div className="wrapper">
            <div className="item item1">
                <Image src={'/images/Pepsi.png'} height={100} width={100} alt="Pepsi" className='object-cover' />
            </div>
            <div className="item item2">
                <Image src={'/images/Unilever.png'} height={100} width={100} alt="Pepsi" className='object-cover' />
            </div>
            <div className="item item3">
                <Image src={'/images/Lay.png'} height={100} width={100} alt="Pepsi" className='object-cover' />
            </div>
            <div className="item item4">
                <Image src={'/images/Vinamilk.png'} height={100} width={100} alt="Pepsi" className='object-cover' />
            </div>
            <div className="item item5">
                <Image src={'/images/Nestle.png'} height={100} width={100} alt="Pepsi" className='object-cover' />
            </div>
            <div className="item item6">
                <Image src={'/images/Coca-Cola.png'} height={100} width={100} alt="Pepsi" className='object-cover' />
            </div>
            <div className="item item7">
                <Image src={'/images/Acecook.png'} height={100} width={100} alt="Pepsi" className='object-cover' />
            </div>
            <div className="item item8">
                <Image src={'/images/Heineken.png'} height={100} width={100} alt="Pepsi" className='object-cover' />
            </div>
        </div>

    );
}

export default InfiniteScroll;