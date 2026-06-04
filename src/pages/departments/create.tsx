import { CreateView } from '@/components/refine-ui/views/create-view';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useBack } from '@refinedev/core';
import React from 'react'

const Create = () => {
    const back = useBack();

  return (
    <CreateView className="departments-create-view">
        <Breadcrumb />

            <h1 className="page-title">Create a Class</h1>
            <div className="intro-row">
                <p>Provide the required information below to add a class.</p>
                <Button onClick={() => back()}>Go Back</Button>
            </div>

           
    </CreateView>
  )
}

export default Create