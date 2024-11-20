// Definición de tipos
interface Task {
  id: number;
  description: string;
  state: 'pendiente' | 'en progreso' | 'completada';
  deadLine: string;
}

interface Project {
  id: number;
  name: string;
  startDate: string;
  tasks: Task[];
}

// Estructura inicial de datos de proyectos
const projects: Project[] = [
  {
    id: 1,
    name: "Proyecto de Desarrollo Web",
    startDate: "2024-11-16",
    tasks: [
      {
        id: 1,
        description: "Configurar el entorno de desarrollo",
        state: "pendiente",
        deadLine: "2024-11-20"
      },
      {
        id: 2,
        description: "Diseñar la estructura de la base de datos",
        state: "en progreso",
        deadLine: "2024-11-22"
      },
      {
        id: 3,
        description: "Desarrollar la API REST",
        state: "completada",
        deadLine: "2024-11-25"
      }
    ]
  },
  {
    id: 2,
    name: "Aplicación Móvil",
    startDate: "2024-11-17",
    tasks: [
      {
        id: 4,
        description: "Crear mockups de la UI",
        state: "pendiente",
        deadLine: "2024-11-21"
      },
      {
        id: 5,
        description: "Desarrollar la lógica de la aplicación",
        state: "en progreso",
        deadLine: "2024-11-23"
      }
    ]
  },
  {
    id: 3,
    name: "Sistema de Inventario",
    startDate: "2024-11-18",
    tasks: [
      {
        id: 6,
        description: "Analizar requisitos",
        state: "pendiente",
        deadLine: "2024-11-19"
      },
      {
        id: 7,
        description: "Diseñar la interfaz de usuario",
        state: "en progreso",
        deadLine: "2024-11-22"
      }
    ]
  },
  {
    id: 4,
    name: "Portal de E-commerce",
    startDate: "2024-11-19",
    tasks: [
      {
        id: 8,
        description: "Configurar servidor",
        state: "pendiente",
        deadLine: "2024-11-20"
      },
      {
        id: 9,
        description: "Integrar pasarela de pago",
        state: "en progreso",
        deadLine: "2024-11-24"
      }
    ]
  },
  {
    id: 5,
    name: "Plataforma de Educación",
    startDate: "2024-11-20",
    tasks: [
      {
        id: 10,
        description: "Crear contenido educativo",
        state: "pendiente",
        deadLine: "2024-11-25"
      },
      {
        id: 11,
        description: "Desarrollar funcionalidades interactivas",
        state: "en progreso",
        deadLine: "2024-11-27"
      }
    ]
  }
];

//   pregunta 1.2:  
// Función para añadir una nueva tarea a un proyecto
function addTask(projectId: number, newTask: Task): void {
  const project = projects.find(proy => proy.id === projectId);  
  if (project) {
    project.tasks.push(newTask);
    console.log(`Tarea añadida al proyecto ${project.name}:`, newTask);
  } else {
    console.log(`Proyecto con ID ${projectId} no encontrado.`);
  }
}
// declaramos la nueva tarea:
const newTask: Task= {
  id: 12,
  description: "Realizar pruebas de integración",
  state: "pendiente",
  deadLine: "2024-12-01"
};

addTask(1, newTask);
console.log(JSON.stringify(projects, null, 2));

// pregunta 1.3:
// creamos una función que genera el resumen mostrando el numero de tareas:
function SummaryOfStates(projects: Project[]): { [key: string]: number } {

  return projects.flatMap(project => project.tasks).reduce((acc, task) => {
    acc[task.state] = (acc[task.state] || 0) + 1;
    return acc;
  }, { pendiente: 0, 'en progreso': 0, completada: 0 })
}

// Formatear los resultados para 'console.table' con nombres personalizados:
const status = SummaryOfStates(projects);
const formattedResults = Object.entries(status).map(([states, quantity]) => ({
  states,
  values: quantity
}))
console.table(formattedResults)

// // pregunta 1.4:
// // creamos una función para ordenar las fechas de forma descendente:
function orderDates(projects: Project[]): {description: string, deadLine: string}[] {
  return projects.flatMap(project => 
      project.tasks.map(task => ({
          description: task.description,
          deadLine: task.deadLine
      }))
  ).sort((a, b) => Date.parse(b.deadLine) - Date.parse(a.deadLine));
}

const tasksList = orderDates(projects);

console.table(tasksList);


// // pregunta 2.
// // pregunta 2.1.
// // creamos una función que filtre las tareas por su respectivo id:
function FilterProjectTasks(projects: Project[]) {
  return projects.flatMap(project => project.tasks.map(task => ({
    id: task.id,
    description: task.description
  })))

}

const filteredTasks = FilterProjectTasks(projects);
console.table(filteredTasks);

// // pregunta 2.2:
// // creamos una función que calcule el tiempo restante antes para terminar una tarea:
// // Función para calcular la diferencia en días entre dos fechas
function calculateDifferenceInDays(startDate: string, endDate: string): number {
  const aDayInMilliseconds = 24 * 60 * 60 * 1000;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const differenceInMilliseconds = end - start; 
  return Math.floor(differenceInMilliseconds / aDayInMilliseconds);  
}
// Función para calcular los días restantes:
function calculateRemainingTime(projects: Project[]) {  
  const filter1 = projects.flatMap(project => project.tasks.filter(task => task.state === "pendiente").map(task => ({
      ...task,
      fecha_inicio_proyecto: project.startDate,
      dias_faltantes: calculateDifferenceInDays(project.startDate, task.deadLine) // Calcula los días faltantes para cada tarea pendiente
  })));
  return filter1;
  
}
const remainingTime = calculateRemainingTime(projects);
console.table(remainingTime);

// pregunta 2.3:
// // Función para calcular los días restantes con condición de días menores a 3 dias:
function calculateRemainingTime2(projects: Project[]) {
  const filter1 = projects.flatMap(project => 
      project.tasks.filter(task=> {
          const missingDays= calculateDifferenceInDays(project.startDate, task.deadLine);
          return task.state === "pendiente" && missingDays < 3; 
      }).map(task => ({
          ...task,
          fecha_inicio_project: project.startDate,
          tareas_criticas: calculateDifferenceInDays(project.startDate, task.deadLine) 
      }))
  );
  return filter1;
}

const remainingTime2 = calculateRemainingTime2(projects);
console.table(remainingTime2);

// pregunta 3.
// // pregunta 3.1:
// // Definición de la función que simula la llamada a la API usando async/await
async function loadDetailsProjectAsync(id: number): Promise<Project> {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          const project = projects.find(project => project.id === id);
          if (project) {
              resolve(project);
          } else {
              reject(new Error('proyecto no encontrado'));
          }
      }, 2000); // Simulando un retraso de 2 segundos
  });
}


// Uso de la función con async/await
async function loadAndShowProject(id: number) {
  try {
      const project = await loadDetailsProjectAsync(id);
      console.log('Detalles del proyecto cargado:', project);
  } catch (error) {
      console.error('Error cargando el proyecto:', error);
  }
}

// Llamada a la función asíncrona
loadAndShowProject(1);

// // pregunta 3.2:

// // Función para simular la actualización del estado de una tarea en el servidor usando Promesas
function updateStatusTask(idProject: number, idTask: number, newState: 'pendiente' | 'en progreso' | 'completada'): Promise<Task> {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          const project = projects.find(project => project.id === idProject);
          if (!project) {
              return reject(new Error('Proyecto no encontrado'));
          }

          const task = project.tasks.find(task => task.id === idTask);
          if (!task) {
              return reject(new Error('Tarea no encontrada'));
          }

          task.state = newState;
          resolve(task);
      }, 2000); // Simulando un retraso de 2 segundos
  });
}

// Uso de la función con Promesas
updateStatusTask(1, 1, 'pendiente')
  .then(updateTask => {
      console.log('Tarea actualizada exitosamente:', updateTask);
  })
  .catch(error => {
      console.error('Error actualizando la tarea:', error);
  });

// Función para simular la actualización del estado de una tarea en el servidor usando async/await
async function updateStatusTaskAsync(idProject: number, idTask: number, newState: 'pendiente' | 'en progreso' | 'completada'): Promise<Task> {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          const project = projects.find(project => project.id === idProject);
          if (!project) {
              return reject(new Error('Proyecto no encontrado'));
          }

          const task = project.tasks.find(task => task.id === idTask);
          if (!task) {
              return reject(new Error('tarea no encontrada'));
          }

          task.state = newState;
          resolve(task);
      }, 2000); // Simulando un retraso de 2 segundos
  });
}

// Uso de la función con async/await
async function handleUpdateTask(idProject: number, idTask: number, newState: 'pendiente' | 'en progreso' | 'completada') {
  try {
      const updatedTask = await updateStatusTaskAsync(idProject, idTask, newState);
      console.log('Tarea actualizada exitosamente:', updatedTask);
  } catch (error) {
      console.error('Error actualizando la tarea:', error);
  }
}

// Llamada a la función asíncrona
handleUpdateTask(1, 1, 'en progreso');


// pregunta 3.3 
import { EventEmitter } from 'events';

// Creamos una instancia de EventEmitter
const notificationsTasks = new EventEmitter();

// Evento "tareaCompleta"
notificationsTasks.on('tareaCompleta', (task: Task) => {
    console.log(`La tarea con ID ${task.id} y descripción "${task.description}" ha sido completada.`);
});

notificationsTasks.on('tareaCompleta', (task: Task) => {
    console.log(`¡Notificación adicional! La tarea con ID ${task.id} ha sido completada.`);
});

// Función para marcar una tarea como completada y emitir el evento
function completeTask(idProject: number, idTask: number) {
    const project = projects.find(project => project.id === idProject);
    if (!project) {
        console.error('project no encontrado');
        return;
    }

    const task = project.tasks.find(task => task.id === idTask);
    if (!task) {
        console.error('Tarea no encontrada');
        return;
    }

    task.state = 'completada';
    notificationsTasks.emit('tareaCompleta', task);
}

// Ejecutamos la funcion completar tarea.
completeTask(1, 1);









