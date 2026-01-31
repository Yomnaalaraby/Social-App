import React from 'react'

export default function PostCardSkeleton() {
    return (
        <div className="card p-6 bg-white rounded-2xl shadow animate-pulse">
            <header className='flex justify-between space-y-5'>
                <div className='flex gap-2 items-center'>
                    <div className='size-11 rounded-full bg-slate-200' />
                    <div className='flex flex-col gap-2'>
                        <div className='h-3 w-24 bg-slate-200 rounded-full'></div>
                        <div className='h-2 w-16 bg-slate-200 rounded-full'></div>
                    </div>
                </div>
                <div className="size-8 bg-slate-200 rounded-full"></div>
            </header>

            <div className="post-info mt-4">
                <div className='flex flex-col gap-2 mb-4'>
                    <div className='h-3 w-3/4 bg-slate-200 rounded-full'></div>
                    <div className='h-3 w-1/2 bg-slate-200 rounded-full'></div>
                </div>

                <div className='-ml-6 -mr-6'>
                    <div className='w-full h-64 bg-slate-200'></div>
                </div>
            </div>

            <div className="reactions flex justify-between mt-4">
                <div className="flex gap-2 items-center">
                    <div className="size-8 rounded-full bg-slate-200"></div>
                    <div className="size-8 rounded-full bg-slate-200"></div>
                    <div className='h-3 w-16 bg-slate-200 rounded-full ml-2'></div>
                </div>
                <div className='h-3 w-20 bg-slate-200 rounded-full'></div>
            </div>

            <div className="action-buttons flex justify-between mt-6 border-y border-gray-400/30 py-4 -mx-6 px-6">
                <div className='h-8 w-20 bg-slate-200 rounded-lg'></div>
                <div className='h-8 w-20 bg-slate-200 rounded-lg'></div>
                <div className='h-8 w-20 bg-slate-200 rounded-lg'></div>
            </div>

            <div className="comments mt-4 space-y-4">
                {/* Comment Skeleton 1 */}
                <div className="flex gap-3">
                    <div className='size-10 rounded-full bg-slate-200 shrink-0'></div>
                    <div className="flex flex-col gap-1 w-full">
                        <div className='bg-slate-200 h-16 w-3/4 rounded-2xl'></div>
                        <div className='flex gap-4 ml-2 mt-1'>
                            <div className='h-2 w-10 bg-slate-200 rounded-full'></div>
                            <div className='h-2 w-10 bg-slate-200 rounded-full'></div>
                        </div>
                    </div>
                </div>
                {/* Comment Skeleton 2 */}
                <div className="flex gap-3">
                    <div className='size-10 rounded-full bg-slate-200 shrink-0'></div>
                    <div className="flex flex-col gap-1 w-full">
                        <div className='bg-slate-200 h-16 w-1/2 rounded-2xl'></div>
                        <div className='flex gap-4 ml-2 mt-1'>
                            <div className='h-2 w-10 bg-slate-200 rounded-full'></div>
                            <div className='h-2 w-10 bg-slate-200 rounded-full'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
