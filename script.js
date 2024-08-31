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
        <p>Snapshot 1 Time: ${new Date(timestamp1).toLocaleString()}</p>
        <p>Snapshot 2 Time: ${new Date(timestamp2).toLocaleString()}</p>
        <p>Total New Connections: ${totalNewConnections}</p>
        <table>
            <tr>
                <th>Name</th>
                <th>Before</th>
                <th>After</th>
                <th>New Connections</th>
            </tr>
    `;

    comparison.forEach(user => {
        resultHTML += `
            <tr>
                <td>${user.Name}</td>
                <td>${user.Before}</td>
                <td>${user.After}</td>
                <td>${user.NewConnections}</td>
            </tr>
        `;
    });

    resultHTML += '</table>';
    resultDiv.innerHTML = resultHTML;
}
