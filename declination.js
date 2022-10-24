/* eslint-disable no-tabs */
function getSex(middleName) {
  if ((middleName || '').length > 2) {
    switch (middleName.substr(middleName.length - 2)) {
      case 'ич':
        return sexM;
      case 'на':
        return sexF;
      default:
        return sexM;
    }
  }
  return '';
}
function Decline(fullName, sex, gcase) {
  const rules = {
    lastName: {
      exceptions: [
        '	дюма,тома,дега,люка,ферма,гамарра,петипа,шандра . . . . .',
        '	гусь,ремень,камень,онук,богода,нечипас,долгопалец,маненок,рева,кива . . . . .',
        '	вий,сой,цой,хой -я -ю -я -ем -е',
      ],
      suffixes: [
        'f	б,в,г,д,ж,з,й,к,л,м,н,п,р,с,т,ф,х,ц,ч,ш,щ,ъ,ь . . . . .',
        'f	ска,цка  -ой -ой -ую -ой -ой',
        'f	ая       --ой --ой --ую --ой --ой',
        '	ская     --ой --ой --ую --ой --ой',
        'f	на       -ой -ой -у -ой -ой',

        '	иной -я -ю -я -ем -е',
        '	уй   -я -ю -я -ем -е',
        '	ца   -ы -е -у -ей -е',

        '	рих  а у а ом е',

        '	ия                      . . . . .',
        '	иа,аа,оа,уа,ыа,еа,юа,эа . . . . .',
        '	их,ых                   . . . . .',
        '	о,е,э,и,ы,у,ю           . . . . .',

        '	ова,ева            -ой -ой -у -ой -ой',
        '	га,ка,ха,ча,ща,жа  -и -е -у -ой -е',
        '	ца  -и -е -у -ей -е',
        '	а   -ы -е -у -ой -е',

        '	ь   -я -ю -я -ем -е',

        '	ия  -и -и -ю -ей -и',
        '	я   -и -е -ю -ей -е',
        '	ей  -я -ю -я -ем -е',

        '	ян,ан,йн   а у а ом е',

        '	ынец,обец  --ца --цу --ца --цем --це',
        '	онец,овец  --ца --цу --ца --цом --це',

        '	ц,ч,ш,щ   а у а ем е',

        '	ай  -я -ю -я -ем -е',
        '	гой,кой  -го -му -го --им -м',
        '	ой  -го -му -го --ым -м',
        '	ах,ив   а у а ом е',

        '	ший,щий,жий,ний  --его --ему --его -м --ем',
        '	кий,ый   --ого --ому --ого -м --ом',
        '	ий       -я -ю -я -ем -и',

        '	ок  --ка --ку --ка --ком --ке',
        '	ец  --ца --цу --ца --цом --це',

        '	в,н а у а ым е',
        '	б,г,д,ж,з,к,л,м,п,р,с,т,ф,х   а у а ом е',
      ],
    },
    firstName: {
      exceptions: [
        '	лев    --ьва --ьву --ьва --ьвом --ьве',
        '	павел  --ла  --лу  --ла  --лом  --ле',
        'm	шота   . . . . .',
        'm	пётр   ---етра ---етру ---етра ---етром ---етре',
        'f	рашель,нинель,николь,габриэль,даниэль   . . . . .',
      ],
      suffixes: [
        '	е,ё,и,о,у,ы,э,ю   . . . . .',
        'f	б,в,г,д,ж,з,й,к,л,м,н,п,р,с,т,ф,х,ц,ч,ш,щ,ъ   . . . . .',

        'f	ь   -и -и . ю -и',
        'm	ь   -я -ю -я -ем -е',

        '	га,ка,ха,ча,ща,жа  -и -е -у -ой -е',
        '	ша  -и -е -у -ей -е',
        '	а   -ы -е -у -ой -е',
        '	ия  -и -и -ю -ей -и',
        '	я   -и -е -ю -ей -е',
        '	ей  -я -ю -я -ем -е',
        '	ий  -я -ю -я -ем -и',
        '	й   -я -ю -я -ем -е',
        '	б,в,г,д,ж,з,к,л,м,н,п,р,с,т,ф,х,ц,ч	 а у а ом е',
      ],
    },
    middleName: {
      suffixes: ['	ич   а  у  а  ем  е', '	на  -ы -е -у -ой -е'],
    },
  };
  let initialized = false;
  /**
   *
   * @param {String} fullName Строка вида "Иванов Иван Иванович" или "Иван Иванович Иванов"
   * @param {String} sex СТрока вида 'm' или 'f'
   * @param {String} gcase Строка из списка: nominative, genitive,
   *                       dative, accusative, instrumentative, prepositional
   * @returns {String} Просклоненные Фамилия Имя Отчество
   */
  function declination(fullName, sex, gcase) {
    if (!fullName) return '';
    let lastName;
    let firstName;
    let middleName;
    const m = fullName.match(/^\s*(\S+)(\s+(\S+)(\s+(\S+))?)?\s*$/);
    if (!m) throw [fio, 'Невозможно разобрать ФИО'];
    if (m[5] && m[3].match(/(ич|на)$/) && !m[5].match(/(ич|на)$/)) {
      // Иван Петрович Сидоров
      lastName = m[5];
      firstName = m[1];
      middleName = m[3];
      this.fullNameSurnameLast = true;
    } else {
      // Сидоров Иван Петрович
      lastName = m[1];
      firstName = m[3];
      middleName = m[5];
    }

    const sexM = 'm';
    const sexF = 'f';

    sex = sex || getSex();

    function prepareRules() {
      for (const type in rules) {
        for (const key in rules[type]) {
          for (let i = 0, n = rules[type][key].length; i < n; i++) {
            rules[type][key][i] = rule(rules[type][key][i]);
          }
        }
      }
    }

    function init() {
      if (initialized) return;
      prepareRules();
      initialized = true;
    }

    function rule(rule) {
      const m = rule.match(/^\s*([fm]?)\s*(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*$/);
      if (m) {
        return {
          sex: m[1],
          test: m[2].split(','),
          mods: [m[3], m[4], m[5], m[6], m[7]],
        };
      }
      return false;
    }

    function word(word, sex, wordType, gcase) {
      if (!word) return '';
      if (gcase === 'nominative') return word;

      // составные слова
      if (word.includes('-')) {
        const list = word.split('-');
        for (let i = 0, n = list.length; i < n; i++) {
          list[i] = word(list[i], sex, wordType, gcase);
        }
        return list.join('-');
      }

      if (word.match(/^[А-ЯЁ]\.?$/i)) return word;

      init();
      const wordTypeRules = rules[wordType];
      let pickRule;
      if (wordTypeRules.exceptions) {
        pickRule = pick(word, sex, gcase, wordTypeRules.exceptions, true);
        if (pickRule) return pickRule;
      }
      pickRule = pick(word, sex, gcase, wordTypeRules.suffixes, false);
      return pickRule || word;
    }

    function pick(word, sex, gcase, rules, matchWholeWord) {
      const wordLower = word.toLowerCase();
      for (let i = 0, n = rules.length; i < n; i++) {
        if (ruleMatch(wordLower, sex, rules[i], matchWholeWord)) {
          return applyMod(word, gcase, rules[i]);
        }
      }
      return false;
    }

    function ruleMatch(word, sex, rule, matchWholeWord) {
      if (rule.sex === sexM && sex === sexF) return false;
      if (rule.sex === sexF && sex !== sexF) return false;
      for (let i = 0, n = rule.test.length; i < n; i++) {
        const test = matchWholeWord ? word : word.substring(Math.max(word.length - rule.test[i].length, 0));
        if (test === rule.test[i]) return true;
      }
      return false;
    }

    function applyMod(word, gcase, rule) {
      let mod = '';
      switch (gcase) {
        case 'nominative':
          mod = '.';
          break;
        case 'genitive':
          mod = rule.mods[0];
          break;
        case 'dative':
          mod = rule.mods[1];
          break;
        case 'accusative':
          mod = rule.mods[2];
          break;
        case 'instrumentative':
          mod = rule.mods[3];
          break;
        case 'prepositional':
          mod = rule.mods[4];
          break;
        default:
          throw [gcase, 'Неизвестный падеж'];
      }
      for (let i = 0, n = mod.length; i < n; i++) {
        const c = mod.substring(i, i + 1);
        switch (c) {
          case '.':
            break;
          case '-':
            word = word.substr(0, word.length - 1);
            break;
          default:
            word += c;
        }
      }
      return word;
    }

    function declineLastName() {
      return word(lastName, sex, 'lastName', gcase);
    }

    function declineFirstName() {
      return word(firstName, sex, 'firstName', gcase);
    }

    function declineMiddleName() {
      return word(middleName, sex, 'middleName', gcase);
    }

    function declineFullName() {
      return `${declineLastName(gcase)} ${declineFirstName(gcase)} ${declineMiddleName(gcase)}`;
    }
    return declineFullName(gcase);
  }

  return declination(fullName, sex, gcase);
}

/*
test
console.log(Decline('Крылов Юрий Николаевич', '', 'instrumentative')); // Крыловым Юрием Николаевичем
console.log(Decline('Сергеева Ольга Константинова', '', 'instrumentative')); // Сергеевой Ольгой Константинова
console.log(Decline('Кирпич Мария Вячеславовна', '', 'instrumentative')); // Кирпичем Марией Вячеславовной
console.log(Decline('Хомут Алексей Юрьевич', '', 'instrumentative')); // Хомутом Алексеем Юрьевичем
*/
