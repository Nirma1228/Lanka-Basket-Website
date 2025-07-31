export const DisplayPriceInRupees = (price)=>{
    return new Intl.NumberFormat('en-LK',{
        style : 'currency',
        currency : 'LKR'
    }).format(price)
}