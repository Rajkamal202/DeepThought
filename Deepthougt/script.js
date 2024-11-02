// Wait for the entire DOM to load before executing the script
document.addEventListener('DOMContentLoaded', function() {
  
  // Get references to the sidebar and main content elements
  const leftSidebar = document.getElementById('leftSidebar');
  const rightSidebar = document.getElementById('rightSidebar');
  const leftSidebarToggle = document.getElementById('leftSidebarToggle');
  const rightSidebarToggle = document.getElementById('rightSidebarToggle');
  const mainContent = document.querySelector('main');

  // Event listener for toggling the visibility of the left sidebar
  leftSidebarToggle.addEventListener('click', () => {
      // Toggle the CSS class to slide the left sidebar in and out of view
      leftSidebar.classList.toggle('-translate-x-full');
      // Adjust the margin of the main content accordingly
      mainContent.classList.toggle('ml-64');
  });

  // Event listener for toggling the visibility of the right sidebar
  rightSidebarToggle.addEventListener('click', () => {
      // Toggle the CSS class to slide the right sidebar in and out of view
      rightSidebar.classList.toggle('translate-x-full');
  });

  // Implement "See More" functionality for content sections
  document.querySelectorAll('.border.rounded.p-4').forEach(item => {
      const button = item.querySelector('button'); // Find the button within the item
      const content = item.querySelector('p'); // Find the paragraph content within the item
      if (button && content) {
          // Event listener for the button click
          button.addEventListener('click', () => {
              // Check if the content is currently truncated
              if (content.classList.contains('line-clamp-2')) {
                  // Remove truncation to show full content
                  content.classList.remove('line-clamp-2');
                  button.textContent = 'See Less'; // Update button text
              } else {
                  // Add truncation to hide excess content
                  content.classList.add('line-clamp-2');
                  button.textContent = 'See More'; // Update button text
              }
          });
          // Initially truncate the content to show only the first two lines
          content.classList.add('line-clamp-2');
      }
  });

  // Functionality for Info Buttons to show additional information
  const infoButtons = document.querySelectorAll('.info-btn');
  infoButtons.forEach(button => {
      button.addEventListener('click', function() {
          const container = this.closest('.asset-container'); // Get the closest asset container
          const content = container.querySelector('.asset-content'); // Find the asset content within the container
          
          // Create or toggle the visibility of the description
          let description = container.querySelector('.asset-description');
          if (!description) {
              // Create a new description element if it doesn't exist
              description = document.createElement('div');
              description.className = 'asset-description';
              description.innerHTML = '<p>Additional information about this section.</p>'; // Set description content
              container.insertBefore(description, content); // Insert it before the content
          } else {
              // Toggle the display style of the description
              description.style.display = description.style.display === 'none' ? 'block' : 'none';
          }
      });
  });

  // Functionality for collapsible sections
  const collapsibles = document.querySelectorAll('.collapsible-header');
  collapsibles.forEach(header => {
      header.addEventListener('click', function() {
          const content = this.nextElementSibling; // Get the content associated with the header
          const icon = this.querySelector('i'); // Find the icon within the header
          
          // Toggle the display style of the content
          content.style.display = content.style.display === 'block' ? 'none' : 'block';
          
          // Toggle the icon class for up/down arrows
          icon.classList.toggle('fa-chevron-down');
          icon.classList.toggle('fa-chevron-up');
      });
  });

  // Functionality to add a new sub-thread
  const addSubThreadBtn = document.querySelector('.bg-blue-600.text-white.px-4.py-2.rounded');
  const threadContainer = document.querySelector('.bg-gray-100.p-4.rounded-lg');
  if (addSubThreadBtn && threadContainer) {
      let subThreadCount = 1; // Initialize sub-thread counter
      addSubThreadBtn.addEventListener('click', () => {
          subThreadCount++; // Increment the sub-thread counter
          // Create a new sub-thread element
          const newSubThread = document.createElement('div');
          newSubThread.className = 'mb-4'; // Set margin
          newSubThread.innerHTML = `
              <h4 class="text-sm font-medium mb-1">Sub Thread ${subThreadCount}</h4>
              <textarea class="w-full p-2 border rounded" placeholder="Enter text here"></textarea>
          `;
          // Insert the new sub-thread before the button
          threadContainer.insertBefore(newSubThread, addSubThreadBtn.parentNode);
      });
  }

  // Fetch project data from the specified JSON endpoint
  fetch('https://dev.deepthought.education/assets/uploads/files/files/others/ddugky_project.json')
      .then(response => response.json()) // Parse the response as JSON
      .then(data => {
          const project = data[0]; // Extract the first project from the data
          
          // Update project title and description in the UI
          document.querySelector('.project-header h1').textContent = project.title;
          document.querySelector('.project-description').innerHTML = project.description;

          // Add commitment information to the project header
          const commitmentInfo = document.createElement('p');
          commitmentInfo.textContent = `Commitment: ${project.commitment}`; // Set commitment text
          document.querySelector('.project-header').appendChild(commitmentInfo); // Append commitment info

          // Create and add learning outcomes to the project header
          const learningOutcomes = document.createElement('div');
          learningOutcomes.innerHTML = `
              <h3>Learning Outcomes:</h3>
              <ul>
                  ${project.learning_outcomes.map(outcome => `<li>${outcome}</li>`).join('')} // Map outcomes to list items
              </ul>
          `;
          document.querySelector('.project-header').appendChild(learningOutcomes);

          // Create and add prerequisites to the project header
          const prerequisites = document.createElement('div');
          prerequisites.innerHTML = `
              <h3>Prerequisites:</h3>
              <ul>
                  ${project.pre_requisites.map(prereq => `<li>${prereq}</li>`).join('')} // Map prerequisites to list items
              </ul>
          `;
          document.querySelector('.project-header').appendChild(prerequisites);

          // Update asset containers with the fetched project tasks and their assets
          project.tasks[0].assets.forEach(asset => {
              const assetContainer = document.querySelector(`.asset-container:has(h3:contains('${asset.asset_title}'))`);
              if (assetContainer) {
                  // Create description element if it doesn't exist
                  const description = assetContainer.querySelector('.asset-description') || document.createElement('div');
                  description.className = 'asset-description'; // Set class name
                  description.style.display = 'none'; // Initially hide the description
                  description.innerHTML = `<p>${asset.asset_description}</p>`; // Set asset description content
                  
                  const content = assetContainer.querySelector('.asset-content'); // Find the asset content
                  // Insert description if it doesn't already exist
                  if (!assetContainer.querySelector('.asset-description')) {
                      assetContainer.insertBefore(description, content);
                  }

                  // Update the asset content based on its type (video or article)
                  if (asset.asset_content_type === 'video') {
                      content.innerHTML = `
                          <div class="video-container">
                              <iframe src="${asset.asset_content}" frameborder="0" allowfullscreen></iframe>
                          </div>
                      `;
                  } else if (asset.asset_content_type === 'article') {
                      content.innerHTML = `
                          <div class="article-container">
                              <a href="${asset.asset_content}" target="_blank">Read Article</a>
                          </div>
                      `;
                  }
              }
          });
      })
      .catch(error => console.error('Error fetching project data:', error)); // Handle any errors during the fetch
});
