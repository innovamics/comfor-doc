Pour commencer à utiliser Git depuis votre ordinateur, vous devez entrer vos
identifiants (nom d’utilisateur et adresse e-mail) afin que Git puisse vous
identifier comme l’auteur de votre travail. Le nom d’utilisateur et l’e-mail
doivent correspondre à ceux que vous utilisez sur GitLab.

Dans votre terminal, ajoutez votre nom d’utilisateur,

```bash
git config --global user.name "your_username"
```

puis votre adresse e-mail:

```bash
git config --global user.email "your_email_address@example.com"
```

Pour vérifier la configuration, vous pouvez exécuter une commande pour afficher
les paramètres enregistrés.

```bash
git config --global --list
```

L’option `--global` indique à Git d’utiliser ces informations pour toutes les
actions effectuées sur votre système. Si vous omettez `--global` ou utilisez
`--local`, la configuration ne s’appliquera qu’au dépôt courant.

Vous pouvez en savoir plus sur la gestion des configurations Git dans la
documentation officielle:
[Personnalisation de Git - Configuration de Git](https://git-scm.com/book/fr/v2/Personnalisation-de-Git-Configuration-de-Git)

## Générer une paire de clés SSH

Si vous ne possédez pas encore de paire de clés SSH, vous devez en générer une nouvelle.

1.  Ouvrez un terminal.
2.  Tapez `ssh-keygen -t` suivi du type de clé et d’un commentaire facultatif. Ce commentaire sera inclus dans le fichier `.pub` généré. Il est courant d’utiliser une adresse e-mail comme commentaire.

    !!! example

        Pour un clé ED25519

        ```bash
        ssh-keygen -t ed25519 -C "<comment>"
        ```

3.  Appuyez sur Entrée. Une sortie similaire s’affichera à l’écran.

    ```console
    $ ssh-keygen -t ed25519 -C "your_email@example.com"
    Generating public/private ed25519 key pair.
    Enter file in which to save the key (/home/user/.ssh/id_ed25519):
    ```

    - Acceptez le nom de fichier et le répertoire proposés, sauf si vous
      souhaitez créer une
      [clé de déploiement](https://docs.gitlab.com/ee/user/project/deploy_keys/index.html)
      ou stocker la clé dans un répertoire spécifique.
    - Vous pouvez également attribuer cette paire de clés SSH à un hôte spécifique
    - Définissez une [phrase de passe](https://www.ssh.com/ssh/passphrase/) si
      vous le souhaitez.

Une confirmation s’affichera, indiquant l’emplacement où vos fichiers ont été enregistrés.

## Ajouter une clé SSH à votre compte GitLab

Pour utiliser SSH avec GitLab, copiez votre clé publique dans votre compte
GitLab.

1. Copiez le contenu de votre fichier de clé publique. Vous pouvez le faire
   manuellement ou à l’aide d’un script. Le nom de fichier par défaut est
   souvent `id_ed25519.pub`, mais peut aussi être `id_rsa.pub`, selon le type de
   clé généré.

    **macOS:**

    ```bash
    tr -d '\n' < ~/.ssh/id_ed25519.pub | pbcopy
    ```

    **Linux:**

    ```bash
    xclip -sel clip < ~/.ssh/id_ed25519.pub
    ```

    **Git Bash on Windows:**

    ```bash
    cat ~/.ssh/id_ed25519.pub | clip
    ```

2. Connectez-vous à GitLab.
3. Cliquez sur votre avatar en haut à droite de l’interface.
4. Sélectionnez **Settings** (Paramètres).
5. Dans le menu de gauche, cliquez sur **SSH Keys**.
6. Dans le champ **Key**, collez le contenu de votre clé publique. Si vous avez
   copié la clé manuellement, assurez-vous de copier l’intégralité de la ligne,
   qui commence généralement par `ssh-ed25519` ou `ssh-rsa`, et peut se terminer
   par un commentaire.
7. Dans le champ **Title**, saisissez une description de la clé, comme
   _Ordinateur portable professionnel_ ou _Station de travail maison_.
8. *Optionnel* : dans le champ **Expires at**, sélectionnez une date d’expiration.
9. Cliquez sur **Add key** (Ajouter la clé).
