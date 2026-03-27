// Data store
    let data = JSON.parse(localStorage.getItem("flashData")) || { name: "Root", type: "folder", children: [] };
    let currentFolder = data;
    let parentStack = [];

    function saveData() { localStorage.setItem("flashData", JSON.stringify(data)); }

    function render(node = data, container = document.getElementById("explorer")) {
      container.innerHTML = "";
      node.children.forEach((item, index) => {
        let div = document.createElement("div");
        div.className = item.type;
        let span = document.createElement("span");
        span.textContent = (item.type === "folder" ? "📁 " : "📝 ") + item.name;
        span.onclick = (e) => {
          e.stopPropagation();
          if (item.type === "folder") {
            parentStack.push(currentFolder);
            currentFolder = item;
            render(item, container);
            document.getElementById("flashcardArea").innerHTML = "";
          } else {
            showFlashcard(item);
          }
        };
        let delBtn = document.createElement("button");
        delBtn.textContent = "X";
        delBtn.className = "delete-btn";
        delBtn.onclick = (e) => {
          e.stopPropagation();
          node.children.splice(index, 1);
          saveData();
          render(node, container);
          document.getElementById("flashcardArea").innerHTML = "";
        };
        div.appendChild(span);
        div.appendChild(delBtn);
        container.appendChild(div);
      });
    }

    function createFolder() {
      let name = document.getElementById("nameInput").value.trim();
      if (!name) return alert("Enter a folder name!");
      currentFolder.children.push({ name, type: "folder", children: [] });
      saveData(); render(currentFolder);
    }

    function showFlashInput() { document.getElementById("flashInputBox").style.display = "block"; }
    function cancelFlashInput() { document.getElementById("flashInputBox").style.display = "none"; }

    function saveFlashcard() {
      let name = document.getElementById("flashName").value.trim();
      let question = document.getElementById("flashQuestion").value.trim();
      let answer = document.getElementById("flashAnswer").value.trim();
      if (!name || !question || !answer) return alert("Please fill in all fields!");
      currentFolder.children.push({ name, type: "file", question, answer });
      saveData(); render(currentFolder);
      cancelFlashInput();
      document.getElementById("flashName").value = "";
      document.getElementById("flashQuestion").value = "";
      document.getElementById("flashAnswer").value = "";
    }

    function showFlashcard(card) {
      let flashArea = document.getElementById("flashcardArea");
      flashArea.innerHTML = "";

      // Flashcard with flip effect
      let flashcard = document.createElement("div");
      flashcard.className = "flashcard";

      let inner = document.createElement("div");
      inner.className = "flashcard-inner";

      let front = document.createElement("div");
      front.className = "flashcard-front";
      front.textContent = card.question;

      let back = document.createElement("div");
      back.className = "flashcard-back";
      back.textContent = card.answer;

      inner.appendChild(front);
      inner.appendChild(back);
      flashcard.appendChild(inner);

      flashcard.addEventListener("click", () => {
        flashcard.classList.toggle("flipped");
      });

      flashArea.appendChild(flashcard);
    }

    function goHome() {
      currentFolder = data;
      parentStack = [];
      render(currentFolder);
      document.getElementById("flashcardArea").innerHTML = "";
    }
    function goBack() {
      if (parentStack.length > 0) {
        currentFolder = parentStack.pop();
        render(currentFolder);
        document.getElementById("flashcardArea").innerHTML = "";
      } else {
        alert("You are already at the root folder!");
      }
    }

    render();
