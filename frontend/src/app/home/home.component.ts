import { Component, OnInit } from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    NgForOf
  ],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private codeSnippets = [
    `function boostProductivity() {
  const dev = new Developer();
  dev.useDevBoost();
  return dev.productivity * 10;
}`,
    `async function optimizeWorkflow() {
  const tasks = await DevBoost.getTasks();
  const optimizedTasks = DevBoost.optimize(tasks);
  return DevBoost.execute(optimizedTasks);
}`,
    `class SmartIDE extends DevBoost {
  constructor() {
    super();
    this.enableAI();
    this.connectTeam();
  }

  code() {
    return this.generateOptimizedCode();
  }
}`
  ];

  features = [
    { icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920227.png', title: 'Smart Automation', description: 'Automate repetitive tasks with AI-powered workflows' },
    { icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920244.png', title: 'Code Sync', description: 'Real-time collaboration across your development team' },
    { icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920239.png', title: 'Intelligent Scheduling', description: 'Optimize your workflow with smart time management' },
    { icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920234.png', title: 'Performance Analytics', description: 'Gain insights into your productivity patterns' }
  ];

  carouselSlides = [
    { image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', alt: 'Collaborative Coding' },
    { image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80', alt: 'Data Analytics' },
    { image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', alt: 'Team Productivity' }
  ];

  productivityStats = [
    { value: '300%', label: 'Productivity Increase' },
    { value: '50%', label: 'Time Saved' },
    { value: '10x', label: 'Faster Deployment' }
  ];

  currentSlide = 0;

  ngOnInit() {
    setInterval(() => this.nextSlide(), 5000);
    this.animateCode();
    this.animateProductivityMeter();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.carouselSlides.length) % this.carouselSlides.length;
  }

  animateCode() {
    const codeElement = document.getElementById('animatedCode')!;
    let snippetIndex = 0;

    const typeCode = (snippet: string, index: number) => {
      if (index < snippet.length) {
        codeElement.innerHTML += snippet.charAt(index);
        setTimeout(() => typeCode(snippet, index + 1), 50);
      } else if (snippetIndex < this.codeSnippets.length - 1) {
        setTimeout(() => {
          codeElement.innerHTML = '';
          snippetIndex++;
          typeCode(this.codeSnippets[snippetIndex], 0);
        }, 2000);
      } else {
        setTimeout(() => {
          codeElement.innerHTML = '';
          snippetIndex = 0;
          typeCode(this.codeSnippets[snippetIndex], 0);
        }, 2000);
      }
    };

    typeCode(this.codeSnippets[snippetIndex], 0);
  }

  animateProductivityMeter() {
    const meterBar = document.querySelector('.meter-bar') as HTMLElement;
    const meterValue = document.querySelector('.meter-value') as HTMLElement;
    let value = 0;

    const updateMeter = () => {
      if (value < 100) {
        value += 1;
        meterBar.style.width = `${value}%`;
        meterValue.textContent = `${value}%`;
        setTimeout(updateMeter, 50);
      } else {
        setTimeout(() => {
          value = 0;
          meterBar.style.width = '0%';
          meterValue.textContent = '0%';
          updateMeter();
        }, 2000);
      }
    };

    updateMeter();
  }
}
