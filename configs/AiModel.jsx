const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  const CodegenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  
    export const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });


    export const GenAiCode=model.startChat({
      generationConfig:CodegenerationConfig,
      history:[
        {
          role: "user",
          parts: [
            {text: "create a todo application  Generate a Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, \nwithout any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from \"lucide-react\" and use it in JSX as <Heart className=\"\" />.\nalso you can use date-fns for date format and react-chartjs-2 chart, graph library\n\nReturn the response in JSON format with the following schema:\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\n\nHere’s the reformatted and improved version of your prompt:\n\nGenerate a programming code structure for a React project using Vite. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from \"lucide-react\" and use it in JSX as <Heart className=\"\" />.\n\nReturn the response in JSON format with the following schema:\n\njson\nCopy code\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\nEnsure the files field contains all created files, and the generatedFiles field lists all the filenames. Each file's code should be included in the code field, following this example:\nfiles:{\n  \"/App.js\": {\n    \"code\": \"import React from 'react';\\nimport './styles.css';\\nexport default function App() {\\n  return (\\n    <div className='p-4 bg-gray-100 text-center'>\\n      <h1 className='text-2xl font-bold text-blue-500'>Hello, Tailwind CSS with Sandpack!</h1>\\n      <p className='mt-2 text-gray-700'>This is a live code editor.</p>\\n    </div>\\n  );\\n}\"\n  }\n}\n  Additionally, include an explanation of the project's structure, purpose, and functionality in the explanation field. Make the response concise and clear in one paragraph.\n  - When asked then only use this package to import, here are some packages available to import and use (date-fns,react-chartjs-2,\"firebase\",\"@google/generative-ai\" ) only when it required\n  \n  - For placeholder images, please use a https://archive.org/download/placeholder-image/placeholder-image.jpg\n  -Add Emoji icons whenever needed to give good user experinence\n  - all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\n- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\n- Use icons from lucide-react for logos.\n\n- Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n \n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"projectTitle\": \"React Todo Application\",\n  \"explanation\": \"This React Todo application allows users to manage their tasks efficiently. It includes features to add, view, mark as complete, and delete tasks. The application uses Tailwind CSS for styling, providing a modern and responsive user interface. Lucide React icons are used for visual elements, enhancing the user experience. Additionally, date-fns is used for date formatting in the task management functionalities.\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"import React from 'react';\\nimport TaskList from './components/TaskList/TaskList';\\nimport AddTaskForm from './components/AddTaskForm/AddTaskForm';\\nimport Header from './components/Header/Header';\\nimport { useState, useEffect } from 'react';\\n\\n\\nfunction App() {\\n  const [tasks, setTasks] = useState(() => {\\n    const storedTasks = localStorage.getItem('tasks');\\n    return storedTasks ? JSON.parse(storedTasks) : [];\\n  });\\n\\n  useEffect(() => {\\n    localStorage.setItem('tasks', JSON.stringify(tasks));\\n  }, [tasks]);\\n\\n  const addTask = (newTask) => {\\n    setTasks([...tasks, newTask]);\\n  };\\n\\n  const toggleComplete = (id) => {\\n    setTasks(tasks.map(task =>\\n      task.id === id ? { ...task, completed: !task.completed } : task\\n    ));\\n  };\\n\\n  const deleteTask = (id) => {\\n    setTasks(tasks.filter(task => task.id !== id));\\n  };\\n\\n  return (\\n    <div className=\\\"bg-gray-100 min-h-screen flex flex-col\\\">\\n      <Header />\\n      <div className=\\\"container mx-auto p-4\\\">\\n        <AddTaskForm onAddTask={addTask} />\\n        <TaskList\\n          tasks={tasks}\\n          onToggleComplete={toggleComplete}\\n          onDeleteTask={deleteTask}\\n        />\\n      </div>\\n    </div>\\n  );\\n}\\n\\nexport default App;\"\n    },\n    \"/components/Header/Header.js\": {\n      \"code\": \"import React from 'react';\\nimport { Clock } from 'lucide-react';\\n\\nfunction Header() {\\n  return (\\n    <header className=\\\"bg-blue-600 text-white py-4 shadow-md\\\">\\n      <div className=\\\"container mx-auto flex items-center justify-between\\\">\\n        <div className=\\\"flex items-center\\\">\\n          <Clock className=\\\"mr-2\\\" size={24} />\\n          <h1 className=\\\"text-xl font-semibold\\\">My Todo App 🚀</h1>\\n        </div>\\n        {/* You can add more header elements here if needed */}\\n      </div>\\n    </header>\\n  );\\n}\\n\\nexport default Header;\"\n    },\n    \"/components/AddTaskForm/AddTaskForm.js\": {\n      \"code\": \"import React, { useState } from 'react';\\nimport { Plus } from 'lucide-react';\\nimport { v4 as uuidv4 } from 'uuid';\\n\\nfunction AddTaskForm({ onAddTask }) {\\n  const [text, setText] = useState('');\\n  const [dueDate, setDueDate] = useState('');\\n\\n  const handleSubmit = (e) => {\\n    e.preventDefault();\\n    if (!text) return;\\n    onAddTask({ id: uuidv4(), text, completed: false, dueDate });\\n    setText('');\\n    setDueDate('');\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className=\\\"mb-4 flex flex-col gap-2\\\">\\n      <input\\n        type=\\\"text\\\"\\n        placeholder=\\\"Add a task...\\\"\\n        value={text}\\n        onChange={(e) => setText(e.target.value)}\\n        className=\\\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\\\"\\n      />\\n      <input\\n        type=\\\"date\\\"\\n        value={dueDate}\\n        onChange={(e) => setDueDate(e.target.value)}\\n        className=\\\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\\\"\\n      />\\n      <button\\n        type=\\\"submit\\\"\\n        className=\\\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline\\\"\\n      >\\n        <Plus className=\\\"inline-block mr-2\\\" size={16} />\\n        Add Task\\n      </button>\\n    </form>\\n  );\\n}\\n\\nexport default AddTaskForm;\"\n    },\n    \"/components/TaskList/TaskList.js\": {\n      \"code\": \"import React from 'react';\\nimport TaskItem from '../TaskItem/TaskItem';\\n\\nfunction TaskList({ tasks, onToggleComplete, onDeleteTask }) {\\n  return (\\n    <ul>\\n      {tasks.map(task => (\\n        <TaskItem\\n          key={task.id}\\n          task={task}\\n          onToggleComplete={onToggleComplete}\\n          onDeleteTask={onDeleteTask}\\n        />\\n      ))}\\n    </ul>\\n  );\\n}\\n\\nexport default TaskList;\"\n    },\n    \"/components/TaskItem/TaskItem.js\": {\n      \"code\": \"import React from 'react';\\nimport { Trash, Check, X } from 'lucide-react';\\nimport { format } from 'date-fns';\\n\\nfunction TaskItem({ task, onToggleComplete, onDeleteTask }) {\\n\\n  const formattedDate = task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No Due Date';\\n\\n  return (\\n    <li className=\\\"flex items-center justify-between py-2 border-b border-gray-200\\\">\\n      <div className=\\\"flex items-center\\\">\\n        <input\\n          type=\\\"checkbox\\\"\\n          checked={task.completed}\\n          onChange={() => onToggleComplete(task.id)}\\n          className=\\\"mr-2 h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded\\\"\\n        />\\n        <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-700'}>\\n          {task.text}\\n        </span>\\n      </div>\\n      <div className=\\\"text-sm text-gray-500\\\">Due: {formattedDate}</div>\\n\\n      <div>\\n        <button\\n          onClick={() => onDeleteTask(task.id)}\\n          className=\\\"text-red-500 hover:text-red-700 focus:outline-none\\\"\\n        >\\n          <Trash size={20} />\\n        </button>\\n      </div>\\n    </li>\\n  );\\n}\\n\\nexport default TaskItem;\"\n    }\n  },\n  \"generatedFiles\": [\n    \"/App.js\",\n    \"/components/Header/Header.js\",\n    \"/components/AddTaskForm/AddTaskForm.js\",\n    \"/components/TaskList/TaskList.js\",\n    \"/components/TaskItem/TaskItem.js\"\n  ]\n}\n```"},
          ],
        },

      ]
      

    })
  
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
