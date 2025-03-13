export interface SecurityBulletinData {
    reference: string;
    date: string;
    version: string;
    alertDate: string;
    title: string;
    source: string;
    products: string;
    criticality: string;
    summary: string;
    risks: string;
    affectedProducts: string;
    exploitationConditions: string;
    detection: string;
    actions: string;
    documentation: string;
  }
  
  export const DEFAULT_BULLETIN_DATA: SecurityBulletinData = {
    reference: '00001',
    date: '24/02/2025',
    version: '1',
    alertDate: '24/02/2025',
    title: 'Vulnérabilité critique CVE-2025-26506 affectant les imprimantes HP LaserJet',
    source: 'https://www.it-connect.fr/les-imprimantes-hp-laserjet-affectees-par-une-faille-de-securite-critique-cve-2025-26506/',
    products: 'Imprimantes HP LaserJet',
    criticality: 'Critique',
    summary: 'La vulnérabilité CVE-2025-26506 est une faille critique dans le firmware des imprimantes HP LaserJet qui permet à un attaquant d\'exécuter du code arbitraire à distance. Cette vulnérabilité résulte d\'un dépassement de mémoire tampon (buffer overflow) dans le service de gestion réseau des imprimantes, qui peut être exploité sans authentification.\n\nUn attaquant peut envoyer une requête réseau spécialement conçue à l\'imprimante(fichier PostScript) pour exploiter cette faille, permettant ainsi de prendre le contrôle de l\'appareil, d\'intercepter des données sensibles, ou de l\'utiliser comme point d\'entrée pour attaquer d\'autres systèmes sur le réseau.',
    risks: `- **Exécution de Code à Distance:** Un attaquant peut exécuter du code malveillant sur l'imprimante.\n- **Interception de Données:** Les documents imprimés ou scannés peuvent être interceptés.\n- **Déni de Service (DoS):** L'imprimante peut être rendue inopérante.\n- **Propagation sur le Réseau:** L'imprimante compromise peut être utilisée pour attaquer d'autres appareils sur le même réseau.`,
    affectedProducts: `- HP LaserJet Pro MFP M130fw\n- HP LaserJet Enterprise M506dn\n- HP LaserJet Ultra M404n\n- HP LaserJet Pro MFP M227fdw\n- HP LaserJet Enterprise M609dn\n\nAutres modèles utilisant le firmware version v2.5.3 ou antérieur.`,
    exploitationConditions: `- L'imprimante doit être connectée à un réseau (local ou internet).\n- Aucune authentification n'est requise pour exploiter cette vulnérabilité.\n- Le firmware doit être en version vulnérable (v2.5.3 ou antérieur).`,
    detection: `Pour vérifier si votre imprimante est vulnérable :\n\n- Accédez au panneau de configuration de l'imprimante.\n- Naviguez vers **Paramètres** > **Informations Système** > **Version du Firmware**.\n- Si la version du firmware est v2.5.3 ou antérieure, l'imprimante est vulnérable.`,
    actions: `L'ASSI recommande :\n\n- **Mettre à Jour le Firmware** : Téléchargez la dernière version du firmware depuis le site officiel de HP et suivez les instructions pour mettre à jour le firmware de l'imprimante.\n- **Restreindre l'Accès Réseau** : Limitez l'accès réseau à l'imprimante en utilisant des règles de pare-feu et désactivez les services réseau inutiles (ex : FTP, Telnet).\n- **Segmenter le Réseau** : Isolez les imprimantes sur un réseau séparé pour limiter les risques de propagation.\n- **Surveillance Réseau** : Utilisez des outils de surveillance pour détecter des activités suspectes sur le réseau.`,
    documentation: `- https://nvd.nist.gov/vuln/detail/CVE-2025-26506?utm_source=chatgpt.com\n- https://www.it-connect.fr/les-imprimantes-hp-laserjet-affectees-par-une-faille-de-securite-critique-cve-2025-26506/`
  };