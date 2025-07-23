import React from 'react'

const CategoryPage = () =>{
    const [openUploadCategory,setOpenUploadCategory] = useState(false)


    return (
    <section className=''>
        <div className='p-2   bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Category</h2>
            <button onClick={()=>setOpenUploadCategory(true)} className='text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded'>Add Category</button>
        </div>
        {
            !categoryData[0] && !loading && (
                <NoData/>
            )
        }


         {
            openUploadCategory && (
                <UploadCategoryModel fetchData={fetchCategory} close={()=>setOpenUploadCategory(false)}/>
            )
        }

    </section>
    );
}
export default CategoryPage