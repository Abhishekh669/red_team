import React from 'react'
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

function CreateWorkspaceCard({onClick} : {onClick : () => void}) {
  return (
    <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className="bg-gray-900 rounded-[15px] border-2 border-dashed border-white p-6 text-center cursor-pointer transition-colors duration-300 ease-in-out hover:border-rose-500 hover:bg-gray-700 w-[300px] h-[270px]"
    onClick={onClick}
  >
    <div className="flex flex-col items-center justify-center h-full">
      <Plus className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-white">Create New Workspace</h3>
      <p className="mt-1 text-sm text-gray-400">Add a new workspace to organize your timers</p>
    </div>
  </motion.div>
  )
}

export default CreateWorkspaceCard
