import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  html,
  css,
  reactjs,
  mongodb,
  git,
  docker,
  highradius,
  grroom,
  threejs,
  aws,
  python,
  rprogramming,
  shell,
  budgettrip,
  resnet,
  waveform,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "AI/ML Engineer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Web Automation",
    icon: creator,
  },
  {
    title: "Python Developer",
    icon: creator,
  },
  {
    title: "Data Analysis",
    icon: creator,
  },
  {
    title: "Data Manipulation",
    icon: creator,
  },
  {
    title: "Data Science",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "docker",
    icon: docker,
  },
  {
    name: "aws",
    icon: aws,
  },
  {
    name: "python",
    icon: python,
  },
  {
    name: "rprogramming",
    icon: rprogramming,
  },
  {
    name: "shell",
    icon: shell,
  },
];

const experiences = [
  {
    title: "Web Automation Engineering Intern/ Product Team Intern",
    company_name: "HighRadius",
    icon: highradius,
    iconBg: "#383E56",
    date: "June 2021 - June 2022",
    points: [
      "Improved the present code structure’s performance and efficiency by generating and integrating new attributes into the framework by implementing innovative solutions by constantly analyzing and optimizing the framework.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Creating web agents and email agents from the ground up with Java and Selenium. Using client portals and emails to navigate. Developing personalized agents capable of automating tasks, retrieving information, and interacting with web portals and email systems.",
      "Participating in code reviews and providing constructive feedback to other developers.",
      "Responsible for updating product code to meet client requirements, addressing defects, and optimizing existing product dependability, functionality, and performance.",
      " Leading and coaching a team of eight interns as they learn the foundations of designing web agents.",
    ],
  },
  {
    title: "Full Stack/ML Engineering Trainee",
    company_name: "HighRadius",
    icon: highradius,
    iconBg: "#383E56",
    date: "October 2020 - May 2021",
    points: [
      "Built a full stack B2B AI Enabled Order Management Web Application incorporating ReactJS, Java Servlets, MySQL, Flask, Jupyter Notebooks",
      "Given a dataset, it was cleaned and all the variables were labelled correctly and data was cleaned using different methods. Univariate Analysis and Bivariate Analysis was performed to get insights along with visualizations. Using the variables new features were created using Feature Engineering. The data set was split into train, validate and test and various machine learning algorithms like xgboost, Support Vector Machines, Linear Regression, Logistic Regression was applied to get the desired output i.e the due date of the payment as well as the bucket for the given due date as well as fix the problems of underfitting and overfitting",
      "Participating in code and concept discussions.",
    ],
  },
  {
    title: "AI/ML Developer",
    company_name: "Grroom",
    icon: grroom,
    iconBg: "#E6DEDD",
    date: "December 2020 - February 2021",
    points: [
      "Used Nvidia GPU P1000 on Google Colab to create a AI model while applying the CNN and YOLO(You Only Look Once) deep learning algorithm to train and test images in batches and classify them accordingly.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "His work was so incredible that we decided to offer him a job during the first month of the internship",
    name: "Nilesh Kumar",
    designation: "Development Team Lead",
    company: "HighRadius Technologies",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "He fixed a bug which was troubling the company for months and months within a short duration and showed consistency during the entire internship duration",
    name: "Rituraj Banerjee",
    designation: "Assosiate Software Engineer",
    company: "HighRadius Technologies",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "He devised the ML/AI part of the the whole application and integrated it within 3 months.",
    name: "Venkatesh Pugalia",
    designation: "Founder and CEO",
    company: "Grroom",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Budget Trip Application",
    description:
      " Developed a user-friendly travel recommendation application titled ”Cheap Thrills” using React.js for frontend and Flask for backend. The application assists users, particularly students, in efficiently planning their holidays by suggesting potential travel destinations considering their specified dates and budget.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "hadoop",
        color: "pink-text-gradient",
      },
      {
        name: "postgres",
        color: "blue-text-gradient",
      },
      {
        name: "PySpark",
        color: "green-text-gradient",
      },
    ],
    image: budgettrip,
    source_code_link: "https://github.com/Purvav0511/CheapThrills",
  },
  {
    name: "Modified ResNet for CIFAR-10 Classification",
    description:
      "Came up with a modified residual network (ResNet) architecture with the highest test accuracy on the CIFAR10 image classification dataset, under the constraint that our model has no more than 5 million parameters.",
    tags: [
      {
        name: "Residual Networks",
        color: "blue-text-gradient",
      },
      {
        name: "PyTorch",
        color: "green-text-gradient",
      },
      {
        name: "Deep Learning",
        color: "pink-text-gradient",
      },
    ],
    image: resnet,
    source_code_link: "https://github.com/Purvav0511/Modified-ResNet-for-CIFAR-10-Classification-with-Under-5-Million-Parameters",
  },
  {
    name: "Waveform based Audio Classification of Environmental Sounds",
    description:
      "This project focuses on the classification of environmental sounds using a deep learning approach. The goal is to compare the effectiveness of waveform-based inputs for audio classification with that of spectrogram-based inputs.",
    tags: [
      {
        name: "Deep Learning",
        color: "blue-text-gradient",
      },
      {
        name: "RNN",
        color: "green-text-gradient",
      },
      {
        name: "PyTorch",
        color: "pink-text-gradient",
      },
    ],
    image: waveform,
    source_code_link: "https://github.com/Purvav0511/Waveform-based-Audio-Classification-of-Environmental-Sounds-Using-Deep-Learning",
  },
];

export { services, technologies, experiences, testimonials, projects };