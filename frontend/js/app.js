// Expense Tracker - frontend logic

// PHASE 2
// Your backend from Phase 1 is already running, with real expenses in the
// database (from schema.sql). Build this page directly against it with
// fetch and async/await - there is no in-memory or localStorage stage
// this time, and no sample data file.
//
// A possible structure (change it if you have a better idea):
//   - async function getExpenses()          fetch(API_URL), return the JSON
//   - async function addExpense(data)       fetch(API_URL, { method: "POST", ... })
//   - async function updateExpense(id,data) fetch(API_URL + "/" + id, { method: "PUT", ... })
//   - async function deleteExpense(id)      fetch(API_URL + "/" + id, { method: "DELETE" })
//   - async function refresh()              get the list, then call renderTable and renderSummary
//   - renderTable(list)                     build the table rows from the array the API returned
//   - renderSummary(list)                   update the summary cards
//   - applyFilter()                         re-render with the list filtered by category
//
// Don't forget:
//   - Show a Bootstrap spinner while a request is in flight.
//   - Wrap every fetch call in try/catch, and show a Bootstrap alert on failure.
//   - After add, edit, or delete, call refresh() so the page always shows
//     what the server actually saved - never update the table by hand.
//   - The API is at http://localhost:3000/api/expenses (see the Roadmap).
const API_URL = "http://localhost:3000/api/expenses";
function showSpinner() {
    document.getElementById("loadingSpinner").classList.remove("d-none");
}

function hideSpinner() {
    document.getElementById("loadingSpinner").classList.add("d-none");
}
function showAlert(message) {
    const alertContainer = document.getElementById("alertContainer");

    alertContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}
async function getExpenses() {

    showSpinner();
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 500));
        return data;

    } catch (error) {
        console.error(error);
        showAlert("Unable to connect to the server.");
        return [];
    }
    finally {
        hideSpinner();
    }
}

function renderSummary(list) {
    const total = list.reduce((sum, expense) => {
        return sum + Number(expense.amount);
    }, 0);

    const count = list.length;

    let highest = null;

    if (list.length > 0) {
        highest = list.reduce((max, expense) => {
            return Number(expense.amount) > Number(max.amount)
                ? expense
                : max;
        });
    }

    document.getElementById("total").textContent = total.toFixed(2);

    document.getElementById("count").textContent = count;

    document.getElementById("highest").textContent = highest ? Number(highest.amount).toFixed(2) : "0.00";

    document.getElementById("highestTitle").textContent = highest ? highest.title : "";
}

function renderTable(list) {
    const tbody = document.getElementById("expensesTableBody");

    tbody.innerHTML = "";

    list.forEach(expense => {
        let categoryClass = "";

        if (expense.category === "Food") {
            categoryClass = "bg-success";
        } else if (expense.category === "Transport") {
            categoryClass = "bg-primary";
        } else if (expense.category === "Bills") {
            categoryClass = "bg-warning text-dark";
        } else if (expense.category === "Entertainment") {
            categoryClass = "bg-danger";
        } else {
            categoryClass = "bg-secondary";
        }
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${expense.title}</td>
            <td>${Number(expense.amount).toFixed(2)}</td>
            
            <td> <span class="badge ${categoryClass}"> ${expense.category} </span></td>
            <td>${expense.date}</td>
       <td class="text-end">
    <button class="btn btn-secondary btn-sm edit-btn"
            data-id="${expense.id}">
        Edit
    </button>

    <button class="btn btn-danger btn-sm delete-btn"
            data-id="${expense.id}">Delete</button></td>
        `;

        tbody.appendChild(tr);
    });
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const confirmed = confirm("Are you sure you want to delete this expense?");
            if (!confirmed) {
                return;
            }
            const id = button.dataset.id;
            await deleteExpense(id);
        });
    });
    document.querySelectorAll(".edit-btn").forEach(button => {

        button.addEventListener("click", () => {

            const id = button.dataset.id;

            const expense = list.find(item => item.id == id);

            document.getElementById("editTitle").value = expense.title;

            document.getElementById("editAmount").value = expense.amount;

            document.getElementById("editCategory").value = expense.category;

            document.getElementById("editDate").value = expense.date;

            document.getElementById("saveEditBtn").dataset.id = id;

            const modal = new bootstrap.Modal(
                document.getElementById("editModal")
            );

            modal.show();

        });

    });
}
document.getElementById("saveEditBtn").addEventListener("click", async () => {

    const id = document.getElementById("saveEditBtn").dataset.id;

    const title = document.getElementById("editTitle");
    const amount = document.getElementById("editAmount");
    const category = document.getElementById("editCategory");
    const date = document.getElementById("editDate");

    const titleError = document.getElementById("editTitleError");
    const amountError = document.getElementById("editAmountError");

    title.classList.remove("is-invalid");
    amount.classList.remove("is-invalid");

    titleError.classList.add("d-none");
    amountError.classList.add("d-none");

    let valid = true;

    if (title.value.trim() === "") {
        title.classList.add("is-invalid");
        titleError.classList.remove("d-none");
        valid = false;
    }

    if (amount.value === "" || Number(amount.value) <= 0) {
        amount.classList.add("is-invalid");
        amountError.classList.remove("d-none");
        valid = false;
    }
    if (!valid) {
        return;
    }

    const data = {
        title: title.value.trim(),
        amount: Number(amount.value),
        category: category.value,
        date: date.value
    };

    await updateExpense(id, data);
});
let currentList = [];
let sortColumn = null;
let sortDirection = "asc";
async function refresh() {
    const list = await getExpenses();
    currentList = list;
    renderTable(list);
    renderSummary(list);
}
function sortTable(column) {

    if (sortColumn === column) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
        sortColumn = column;
        sortDirection = "asc";
    }

    const sortedList = [...currentList].sort((a, b) => {

        let valueA = a[column];
        let valueB = b[column];

        if (column === "amount") {
            valueA = Number(valueA);
            valueB = Number(valueB);
        } else {
            valueA = String(valueA).toLowerCase();
            valueB = String(valueB).toLowerCase();
        }

        if (valueA < valueB) {
            return sortDirection === "asc" ? -1 : 1;
        }

        if (valueA > valueB) {
            return sortDirection === "asc" ? 1 : -1;
        }

        return 0;
    });

    renderTable(sortedList);
}
document.querySelectorAll(".sortable").forEach(header => {

    header.addEventListener("click", () => {

        const column = header.dataset.column;

        sortTable(column);

    });

});
async function addExpense(data) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to add expense");
        }

        await refresh();

        document.getElementById("title").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("date").value = "";
        document.getElementById("category").selectedIndex = 0;
    } catch (error) {
        console.error(error);
        showAlert(error.message);
    }
}
document.getElementById("expenseForm").addEventListener("submit", async (event) => {

    event.preventDefault();
    const form = event.target;

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const data = {
        title: document.getElementById("title").value.trim(),
        amount: Number(document.getElementById("amount").value),
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };

    await addExpense(data);
});
async function deleteExpense(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to delete expense");
        }

        await refresh();

    } catch (error) {
        console.error(error);
        showAlert(error.message);
    }
}
async function updateExpense(id, data) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update expense");
        }

        await refresh();
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("editModal")
        );

        modal.hide();
    } catch (error) {
        console.error(error);
        showAlert(error.message);
    }
}
function applyFilter() {
    const category = document.getElementById("filterCategory").value;

    if (category === "All") {
        refresh();
        return;
    }

    getExpenses().then(list => {
        const filteredList = list.filter(expense => {
            return expense.category === category;
        });

        renderTable(filteredList);
    });
}
document.getElementById("filterCategory").addEventListener("change", applyFilter);

refresh();
document.getElementById("darkModeBtn").addEventListener("click", () => {

    const button = document.getElementById("darkModeBtn");
    const icon = document.getElementById("darkModeIcon");
    const text = document.getElementById("darkModeText");

    icon.classList.add("changing");

    setTimeout(() => {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            icon.textContent = "☀️";
            text.textContent = "Light Mode";
        } else {
            icon.textContent = "🌙";
            text.textContent = "Dark Mode";
        }

        icon.classList.remove("changing");

    }, 200);
});