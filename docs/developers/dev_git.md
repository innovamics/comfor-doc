To start using Git from your computer, you must enter your credentials (user name and email) to identify you as the author of your work. The user name and email should match the ones you’re using on GitLab.

In your shell, add your user name:

```bash
git config --global user.name "your_username"
```

And your email address:

```bash
git config --global user.email "your_email_address@example.com"
```

To check the configuration, run:

```bash
git config --global --list
```

The `--global` option tells Git to always use this information for anything you do on your system. If you omit `--global` or use `--local`, the configuration is applied only to the current repository.

You can read more on how Git manages configurations in [Customizing-Git-Git-Configuration](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration)

## Generate an SSH key pair

If you do not have an existing SSH key pair, generate a new one.

1.  Open a terminal.
2.  Type `ssh-keygen -t` followed by the key type and an optional comment. This comment is included in the `.pub` file that’s created. You may want to use an email address for the comment.
    
    For example, for ED25519:
    
    ```bash
    ssh-keygen -t ed25519 -C "<comment>"
    ```
    
3. Press ++return++. Output similar to the following is displayed:

```console
$ ssh-keygen -t ed25519 -C "your_email@example.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/user/.ssh/id_ed25519):
```

   - Accept the suggested filename and directory, unless you are generating a [deploy key](https://docs.gitlab.com/ee/user/project/deploy_keys/index.html) or want to save in a specific directory where you store other keys.
    
    You can also dedicate the SSH key pair to a [specific host](https://docs.gitlab.com/ee/ssh/README.html#configure-ssh-to-point-to-a-different-directory).
    
   - Specify a [passphrase](https://www.ssh.com/ssh/passphrase/):
    
    ```console
    Enter passphrase (empty for no passphrase):
    Enter same passphrase again:
    ```
    
A confirmation is displayed, including information about where your files are stored.

## Add an SSH key to your Git platform account

=== "GitLab :simple-gitlab:"

    To use SSH with GitLab, add your public key to your GitLab account settings.

    1.  Copy the contents of your public key file. You can do this manually or use a script. For example, to copy an ED25519 key to the clipboard:

        **macOS:**
        ```bash
        tr -d '\n' < ~/.ssh/id_ed25519.pub | pbcopy
        ```
        **Linux** (requires the `xclip` package):
        ```bash
        xclip -sel clip < ~/.ssh/id_ed25519.pub
        ```
        **Git Bash on Windows:**
        ```bash
        cat ~/.ssh/id_ed25519.pub | clip
        ```

    2.  Replace `id_ed25519.pub` with your filename. For example, use `id_rsa.pub` for RSA.
    3.  Sign in to [GitLab](https://gitlab.com/).
    4.  In the top-left corner, select your avatar.
    5.  Select **Settings**.
    6.  From the left sidebar, select **SSH Keys**.
    7.  In the **Key** box, paste the contents of your public key. If you manually copied the key, make sure you copy the entire key, which starts with `ssh-ed25519` or `ssh-rsa`, and may end with a comment.
    8.  In the **Title** text box, type a description, like _Work Laptop_ or _Home Workstation_.
    9.  Optional. In the **Expires at** box, select an expiration date. (Introduced in [GitLab 12.9](https://gitlab.com/gitlab-org/gitlab/-/issues/36243).) The expiration date is informational only, and does not prevent you from using the key. However, administrators can view expiration dates and use them for guidance when [deleting keys](https://docs.gitlab.com/ee/user/admin_area/credentials_inventory.html#delete-a-users-ssh-key).
    10.  Select **Add key**.

=== "GitHub :simple-github:"

    To use SSH with GitHub, add your public key to your GitHub account settings.

    1.  Copy the contents of your public key file. You can do this manually or use a script. For example, to copy an ED25519 key to the clipboard:

        **macOS:**
        ```bash
        tr -d '\n' < ~/.ssh/id_ed25519.pub | pbcopy
        ```
        **Linux** (requires the `xclip` package):
        ```bash
        xclip -sel clip < ~/.ssh/id_ed25519.pub
        ```
        **Git Bash on Windows:**
        ```bash
        cat ~/.ssh/id_ed25519.pub | clip
        ```

    2. Replace `id_ed25519.pub` with your filename. For example, use `id_rsa.pub` for RSA.
    3. Sign in to [GitHub](https://github.com/).
    4. In the top-right corner, select your avatar.
    5. Select **Settings**.
    6. From the left sidebar, select **SSH and GPG keys**.
    7. Click **New SSH key**.
    8. In the **Title** field, add a descriptive label (e.g., *Work Laptop* or *Home Workstation*).
    9. In the **Key** field, paste your public key. Ensure the entire key is copied, starting with `ssh-ed25519`, `ssh-rsa`, or similar.
    10. Select **Add SSH key**.
