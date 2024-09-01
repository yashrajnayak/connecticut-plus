document.addEventListener('DOMContentLoaded', () => {
    const compareBtn = document.getElementById('compare');
    const resetBtn = document.getElementById('reset');
    const resultDiv = document.getElementById('result');
    const totalConnectionsSpan = document.getElementById('total-connections');
    const newConnectionsSpan = document.getElementById('new-connections');

    compareBtn.addEventListener('click', () => {
        // Your comparison logic here
        const totalConnections = 0; // Replace with actual calculation
        const newConnections = 0; // Replace with actual calculation

        // Update result values
        totalConnectionsSpan.textContent = totalConnections;
        newConnectionsSpan.textContent = newConnections;

        // Show results and hide compare button
        resultDiv.classList.remove('hidden');
        compareBtn.classList.add('hidden');
    });

    resetBtn.addEventListener('click', () => {
        // Reset form and hide results
        document.getElementById('snapshot1').value = '';
        document.getElementById('snapshot2').value = '';
        resultDiv.classList.add('hidden');
        compareBtn.classList.remove('hidden');
    });
});

// Get DOM elements
const compareButton = document.getElementById('compare');
const snapshot1Input = document.getElementById('snapshot1');
const snapshot2Input = document.getElementById('snapshot2');
const resultDiv = document.getElementById('result');

// Add event listener
compareButton.addEventListener('click', compareSnapshots);

/**
 * Compare two snapshots and display the results
 */
function compareSnapshots() {
    try {
        const snapshot1 = JSON.parse(snapshot1Input.value);
        const snapshot2 = JSON.parse(snapshot2Input.value);

        const comparison = snapshot2.data.map(user2 => {
            const user1 = snapshot1.data.find(u => u.Name === user2.Name);
            const before = user1 ? parseInt(user1.Count) : 0;
            const after = parseInt(user2.Count);
            const newConnections = after - before;
            return { Name: user2.Name, Before: before, After: after, NewConnections: newConnections };
        });

        comparison.sort((a, b) => b.NewConnections - a.NewConnections);

        displayResults(comparison, snapshot1.timestamp, snapshot2.timestamp);
    } catch (error) {
        alert('Error parsing snapshots. Please make sure you\'ve pasted valid snapshot data.');
        console.error(error);
    }
}

/**
 * Display the comparison results in the UI
 * @param {Array} comparison - Array of comparison results
 * @param {string} timestamp1 - Timestamp of the first snapshot
 * @param {string} timestamp2 - Timestamp of the second snapshot
 */
function displayResults(comparison, timestamp1, timestamp2) {
    const totalNewConnections = comparison.reduce((sum, user) => sum + user.NewConnections, 0);

    let resultHTML = `
        <h2>Comparison Results</h2>
        <div class="snapshot-times">
            <p><strong>Snapshot 1 Time:</strong> ${new Date(timestamp1).toLocaleString()}</p>
            <p><strong>Snapshot 2 Time:</strong> ${new Date(timestamp2).toLocaleString()}</p>
        </div>
        <div class="total-connections">
            <h3>Total New Connections</h3>
            <span class="big-number">${totalNewConnections}</span>
        </div>
        <table id="results-table">
            <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Before</th>
                <th>After</th>
                <th>New Connections</th>
            </tr>
    `;

    comparison.forEach(user => {
        resultHTML += `
            <tr>
                <td>${user.Name}</td>
                <td>${user.Username || 'N/A'}</td>
                <td>${user.Before}</td>
                <td>${user.After}</td>
                <td>${user.NewConnections}</td>
            </tr>
        `;
    });

    resultHTML += `
        </table>
        <button id="copy-table" class="btn">Copy Table to Clipboard</button>
    `;
    resultDiv.innerHTML = resultHTML;

    // Add event listener for the copy button
    document.getElementById('copy-table').addEventListener('click', copyTableToClipboard);
}

function copyTableToClipboard() {
    const table = document.getElementById('results-table');
    const range = document.createRange();
    range.selectNode(table);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Table copied to clipboard!');
}
