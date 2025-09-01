import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import moment from 'moment';
import AvatarGroup from '../../components/AvatarGroup';

const ViewTaskDetails = () => {
  const {id} = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch(status){
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";

      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  //get Task info by id
  const getTaskDetailsByID = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );

      if(response.data){
        const taskInfo = response.data;
        setTask(taskInfo);
      }
    } catch(error){
      console.error("Error fetching users:", error);
    }

  };

  //handle todo check
  const updateTodoChecklist = async(index) => {};

  //Handle attchment link click
  const handleLinkClick = (link) => {
    window.open(link, '_blank');
  };

  useEffect(() => {
    if(id){
      getTaskDetailsByID();
    }
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className='mt-5'>
        {task && (
          <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
          <div className='form-card col-span-3'>
            <div className='flex items-center justify-between'>
              <h2 className='text-sm md:text-xl font-medium'>
                {task?.title}
              </h2>

              <div 
                className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(task?.status)} px-4 py-0.5 rounded` }
              >
                {task?.status}
              </div>
            </div>
            <div className='mt-4'>
              <InfoBox label="Description" value={task?.description} />
            </div>

            <div className='grid grid-cols-12 gap-4 mt-4'>
              <div className='col-span-6 md:col-span-4'>
                <InfoBox label="Priority" value={task?.priority} />
              </div>
              <div className='col-span-6 md:col-span-4'>
                <InfoBox
                  label="Due Date"
                  value={
                    task?.dueDate
                      ? moment(task?.dueDate).format("DD MMM YYYY") : "N/A"
                  }
                />
              </div>
              <div className='col-span-6 md:col-span-4'>
                <label className='text-xs font-medium text-slate-500'>
                  Assigned To
                </label>

                <AvatarGroup
                  avatars={
                    task?.assignedTO?.map((item) => item?.profileImageUrl) || []
                  }
                  maxVisible={5}
                />
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ViewTaskDetails;

const InfoBox = ({label, value}) => {
  return (
    <>
      <label className='text-xs font-medium text-slate-500'>{label}</label>

      <p className='text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5'>
        {value}
      </p>
    </>
  );
};