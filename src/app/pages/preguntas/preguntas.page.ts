// faq.page.ts
import { Component } from '@angular/core';

export interface FaqCategory {
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  answer1: FaqQuestion[];
  answer2: FaqQuestion[];
  answer3: FaqQuestion[];
  answer4: FaqQuestion[];
  expandedQuestion: string | null;
}

export interface FaqQuestion {
  answer: string;
}

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
})
export class PreguntasPage {
  preguntas: FaqCategory[] = [
    {
      question1: '¿Qué puedo ver en la página de inicio?',
      answer1: [
        { answer: 'En la página de inicio se muestran todos los anuncios creados por todos los usuarios en el programa.' },
      ],
      question2: '¿Cómo puedo crear, modificar, o eliminar un anuncio?',
      answer2: [
        { answer: 'Dirígete al menu de la izquierda y redirígete a la página de ""Anunios Propios"". Eso sí, lamentamos que actualmente estas funciones no se encuentran disponibles en cuanto a su funcionalidad.' },
      ],
      question3: '¿Puedo entrar en mi cuenta sin tener que iniciar sesión de nuevo en caso de no haber cerrado sesión?',
      answer3: [
        { answer: '¡Claro! El programa está capacitado para que una vez entres en él puedas volver a hacerlo sin introducir de nuevo tus datos a menos que decidas cerrar sesión.' },
      ],
      question4: '¿Cómo puedo saber quién se ha encargado e la creación de este programa?',
      answer4: [
        { answer: 'Puedes acceder a la información general del autor del programa en la página de ""Sobre mí".' },
      ],
      expandedQuestion: null,
    },
    // Otras categorías y preguntas
  ];

  toggleGroup(faq: FaqCategory, question: string) {
    if (faq.expandedQuestion === question) {
      faq.expandedQuestion = null;
    } else {
      faq.expandedQuestion = question;
    }
  }
}
