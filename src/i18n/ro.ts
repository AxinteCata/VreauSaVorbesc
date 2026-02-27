/**
 * Romanian UI strings. Short, clear labels for child and caregiver.
 */

export const ro = {
  // App & loading
  'app.title': 'Tablou AAC',
  'app.loading': 'Se încarcă…',
  'app.boardLoading': 'Se încarcă tabloul…',

  // Header (child mode)
  'header.repeat': 'Repetă',
  'header.repeatTitle': 'Spune din nou ultima frază',
  'header.caregiver': 'Mod adult',
  'header.caregiverEnter': 'Intră în modul adult',

  // Header (caregiver mode)
  'header.sentence': 'Propoziție',
  'header.sentenceMode': 'Mod propoziție',
  'header.calm': 'Liniste',
  'header.lowStimulation': 'Mai puține animații',
  'header.lockNav': 'Blochează navigarea',
  'header.lockNavInChild': 'În mod copil, nu se schimbă categoria',
  'header.childMode': 'Mod copil',
  'header.childModeSwitch': 'Treci la modul copil',

  // Sentence strip
  'strip.speak': 'Spune propoziția',
  'strip.clear': 'Șterge',
  'strip.aria': 'Banda de propoziție',

  // Categories (default names – also used in seed)
  'cat.needs': 'Nevoi',
  'cat.feelings': 'Sentimente',
  'cat.food': 'Mâncare',
  'cat.play': 'Joc',
  'cat.people': 'Oameni',

  // Tiles (default seed – Romanian)
  'tile.water': 'Apă',
  'tile.food': 'Mâncare',
  'tile.bathroom': 'Toaletă',
  'tile.help': 'Ajutor',
  'tile.break': 'Am nevoie de pauză',
  'tile.happy': 'Mă simt bine',
  'tile.sad': 'Mă simt trist',
  'tile.angry': 'Sunt supărat',
  'tile.scared': 'Mi-e frică',
  'tile.tired': 'Sunt obosit',
  'tile.tooLoud': 'E prea zgomot',
  'tile.apple': 'Măr',
  'tile.bread': 'Pâine',
  'tile.milk': 'Lapte',
  'tile.juice': 'Suc',
  'tile.play': 'Vreau să mă joc',
  'tile.outside': 'Afară',
  'tile.book': 'Carte',
  'tile.music': 'Muzică',
  'tile.mom': 'Mami',
  'tile.dad': 'Tati',
  'tile.yes': 'Da',
  'tile.no': 'Nu',
  'tile.more': 'Mai vreau',

  // Board
  'board.tilesAria': 'Plăci',
  'board.defaultName': 'Tabloul meu',

  // Editor
  'editor.title': 'Editează tabloul',
  'editor.boardName': 'Nume tablou',
  'editor.columns': 'Coloane',
  'editor.rows': 'Rânduri',
  'editor.categories': 'Categorii',
  'editor.addCategory': 'Adaugă categorie',
  'editor.newCategoryPlaceholder': 'Nume categorie nouă',
  'editor.tilesIn': 'Plăci în „{name}"',
  'editor.addTile': 'Adaugă placă',
  'editor.newTilePlaceholder': 'Text placă nouă',
  'editor.speechPlaceholder': 'Text vorbit',
  'editor.addImage': 'Adaugă imagine',
  'editor.changeImage': 'Schimbă imaginea',
  'editor.removeImage': 'Elimină imaginea',
  'editor.edit': 'Modifică',
  'editor.done': 'Gata',
  'editor.delete': 'Șterge',
  'editor.deleteCategory': 'Șterge categoria {name}',
  'editor.deleteTile': 'Șterge {label}',
  'editor.resetConfirmTitle': 'Înlocuiești toate tablourile cu cele implicite?',
  'editor.resetConfirmBody': 'Nu se poate anula. Tablourile actuale vor fi înlocuite.',
  'editor.resetConfirmYes': 'Da, resetează',
  'editor.resetConfirmCancel': 'Anulare',
  'editor.resetButton': 'Resetează la tabloul implicit',

  // PIN dialog
  'pin.title': 'Introdu PIN-ul pentru mod adult',
  'pin.hint': 'PIN-ul e stocat doar pe acest dispozitiv. Lasă gol dacă nu ai setat unul.',
  'pin.placeholder': 'PIN',
  'pin.cancel': 'Anulare',
  'pin.enter': 'Intră',
  'pin.incorrect': 'PIN incorect',

  // Settings
  'settings.title': 'Setări',
  'settings.back': 'Înapoi',
  'settings.voice': 'Voce pentru vorbire',
  'settings.voiceHint': 'Pe telefon sau tabletă se folosește vocea dispozitivului (cea mai bună disponibilă). Pe calculator poți alege „Natural” (Piper).',
  'settings.voiceNatural': 'Natural (Piper – română)',
  'settings.voiceLoading': 'Se încarcă vocile…',
  'settings.voiceDefault': 'Implicit (sistem)',
  'settings.voiceSample': 'Ascultă un exemplu',
  'settings.voiceSampleText': 'Bună, acesta e un exemplu.',
  'settings.pin': 'PIN mod adult',
  'settings.pinHint': 'Opțional. Dacă e setat, intrarea în mod adult cere PIN-ul. Stocat doar aici.',
  'settings.pinSet': 'PIN-ul e setat.',
  'settings.pinPlaceholderSet': 'PIN nou pentru schimbare',
  'settings.pinPlaceholderNew': 'Setare PIN',
  'settings.pinSetButton': 'Setare PIN',
  'settings.pinChangeButton': 'Schimbă PIN',
  'settings.pinRemove': 'Elimină PIN',
  'settings.about': 'Despre',
  'settings.credits': 'Credite și licențe',

  // Footer (caregiver)
  'footer.settings': 'Setări',
  'footer.credits': 'Credite și licențe',

  // Credits
  'credits.title': 'Credite și licențe',
  'credits.back': 'Înapoi',
  'credits.appHeading': 'Această aplicație',
  'credits.appDesc': 'Tablou AAC este gratuit și open-source. Fără analize, fără urmărire; datele rămân pe dispozitivul tău.',
  'credits.appLicense': 'Licență: MIT. Copyright (c) Contribuitori Tablou AAC.',
  'credits.mitSummary': 'Text complet licență MIT',
  'credits.thirdParty': 'Biblioteci terțe',
  'credits.source': 'Sursă',
  'credits.symbolsHeading': 'Surse pentru simboluri și imagini',
  'credits.symbolsDesc': 'Aplicația nu include seturi de simboluri. Dacă folosești simboluri terțe, adaugă atribuirea aici și respectă licențele.',
  'credits.symbolsPlaceholder': 'Exemplu: Simboluri de la [Nume] – [Licență], [URL]',
  'credits.userImagesHeading': 'Imagini încărcate de tine',
  'credits.userImagesDisclaimer': 'Avertisment',
  'credits.userImagesBody': 'Imaginile pe care le încarci sunt stocate doar pe acest dispozitiv. Ești responsabil(ă) că ai dreptul de a le folosi. Aplicația nu acordă și nu verifică drepturi pentru conținut încărcat. Nu încărca materiale care încalcă drepturi de autor sau ale altora.',
  'credits.privacyHeading': 'Confidențialitate',
  'credits.privacyBody': 'Toate datele sunt stocate local. Nimic nu e trimis pe internet. Fără analize și fără urmărire.',

  // PWA
  'pwa.offline': 'Fără internet',
  'pwa.installTitle': 'Instalare Tablou AAC',
  'pwa.installDesc': 'Adaugă pe ecranul de start pentru acces rapid și folosire offline.',
  'pwa.install': 'Instalare',
  'pwa.notNow': 'Nu acum',
} as const;
