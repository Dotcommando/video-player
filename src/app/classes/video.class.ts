export class VideoClass {
  uid: string;
  sources: string[];
  title: string;
  intro: string;
  description: string;
  poster: string;
  viewed: number;
  liked: number;

  constructor(value: any) {
    this.uid = '';
    this.sources = [];
    this.title = '';
    this.intro = '';
    this.description = '';
    this.poster = '';
    this.viewed = 0;
    this.liked = 0;
    if (typeof(value) === 'object') {
      this.uid = value.uid !== undefined ? value.uid : '';
      this.sources = [];
      if (value.sources !== undefined) {
        if (value.sources.length !== undefined) {
          this.sources = value.sources;
        }
      }
      if (value.title !== undefined) {
        this.title = value.title;
      }
      if (value.intro !== undefined) {
        this.intro = value.intro;
      }
      if (value.description !== undefined) {
        this.description = value.description;
      }
      if (value.poster !== undefined) {
        this.poster = value.poster;
      }
      if (value.viewed !== undefined) {
        this.viewed = value.viewed;
      }
      if (value.liked !== undefined) {
        this.liked = value.liked;
      }
    }
  }
}

/**
 * Объект ответа. Содержит лишь свойство value.
 * Если ответы сохранять как массив строк,
 * то после генерации инпутов обновляя содержимое
 * одного инпута, обновляется весь массив. И textarea,
 * содержащий ответ из массива, теряет фокус после
 * ввода одного символа.
 * Поэтому так.
 */
export class Answer {
  value: string;
  constructor(val: any) {
    this.value = '';
    if (typeof(val) === 'object') {
      if (val.value !== undefined && val.value !== null) {
        if (typeof(val.value) === 'string') {
          this.value = val.value;
        }
      }
    }
  }
}

/**
 * Объект описывает отдельный вопрос в триггерной точке.
 *
 * point:   uid объекта TriggerPoint,
 * uid:     собственный uid,
 * answers: массив возможных ответов,
 * type:    тип ответов: радиокнопки,
 *          чекбоксы или список, который надо упорядочивать.
 */
export class TriggerQuestion {
  point: string;
  uid: string;
  question: string;
  answers: Answer[];
  right: string;
  type: 'Radio' | 'Checkbox' | 'List';
  constructor(value?: any) {
    this.point = '';
    this.uid = '';
    this.question = '';
    this.answers = [];
    this.right = '0';
    this.type = 'Radio';
    if (typeof(value) === 'object') {
      this.type = value.type === 'Radio' ||
                  value.type === 'Checkbox' ||
                  value.type === 'List' ? value.type : 'Radio';
      this.point = (value.point !== undefined && value.point !== null) ? value.point : '';
      this.uid = (value.uid !== undefined && value.uid !== null) ? value.uid : '';
      this.question = (value.question !== undefined && value.question !== null) ? value.question : '';
      if (value.answers instanceof Array) {
        const len = value.answers.length;
        if (len !== undefined) {
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              if (value.answers[i].value !== undefined && value.answers[i].value !== null) {
                if (typeof(value.answers[i].value) === 'string') {
                  this.answers.push(new Answer({value: value.answers[i].value}));
                }
              }
            }
          }
        }
      }
      if (typeof(value.right) === 'string') {
        this.right = value.right;
      }
    }
  }
}

/**
 * Объект описывает триггерную точку видео.
 *
 * video:    uid ролика, к которому относится данная точка,
 * uid:      собственный uid,
 * question: вопрос, описывается типом TriggerQuestion,
 * time:     секунды, где стоит точка,
 * disallowSeeking: запрщает перемотку за свою грань или нет.
 */
export class TriggerPoint {
  video: string;
  uid: string;
  question: TriggerQuestion;
  time: number;
  disallowSeeking: boolean;
  constructor(value?: any) {
    this.video = '';
    this.uid = '';
    this.time = 5;
    this.disallowSeeking = false;
    this.question = new TriggerQuestion();
    if (typeof(value) === 'object') {
      this.video = (value.video !== undefined && value.video !== null) ? value.video : '';
      this.uid = (value.uid !== undefined && value.uid !== null) ? value.uid : '';
      if (value.disallowSeeking !== undefined && value.disallowSeeking !== null) {
        if (value.disallowSeeking === true || value.disallowSeeking === false) {
          this.disallowSeeking = value.disallowSeeking;
        }
      }
      if (typeof(value.time) === 'number' && value.time.toString() !== 'NaN') {
        this.time = value.time;
      }
      this.question = new TriggerQuestion(value.question);
    }
  }
}
