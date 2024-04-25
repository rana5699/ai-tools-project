const getElement = (id) => {
  return document.getElementById(id);
};
const toolsContainer = getElement("toolsContainer");
const showAllBtn = getElement("showAllBtn");
const sortByDate = getElement("sortByDate");
const showModal = getElement("showModal");
const tooName = getElement("tooName");
const searchBtn = getElement("searchBtn");
const searchInput = getElement("searchInput");

const loadData = async () => {
  const res = await fetch("https://openapi.programming-hero.com/api/ai/tools");
  const data = await res.json();
  const allAiTools = data.data.tools;
  displayData(allAiTools);
};

// create tool card START here
const createTooCard = (tool) => {
  const div = document.createElement("div");
  const toolCard = `
     <div class="card shadow-xl border border-[#1111111A] p-5">
            <figure>
              <img
                class="rounded-lg w-96 h-72"
                src="${tool?.image}"
                alt="${tool?.name}"
              />
            </figure>
            <div class="">
              <h2 class="text-xl font-medium my-2">${tool?.name}</h2>
              <div class="mb-3">
                <ul class="list-decimal px-5 my-2">
                ${tool.features
                  .map((feature) => (feature ? `<li>${feature}</li>` : ""))
                  .join("")}
                </ul>
              </div>
              <hr />
              <div class="mt-5">
                <h2 class="text-xl font-medium">${tool?.name}</h2>
                <div class="my-2 flex justify-between items-center">
                  <div class="text-xl flex items-center gap-3">
                    <i class="fa-solid fa-calendar-days"></i>
                    <p>${tool?.published_in}</p>
                  </div>
                  <div>
                   <button onclick="showDetails('${tool.id}')"
                      class="text-red-400 text-2xl bg-red-100 p-2 text-center rounded-full"
                    >
                      <i class="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
    `;
  div.innerHTML = toolCard;
  toolsContainer.appendChild(div);
};
// create tool card END here

// create tool card details START here
const createToolCardDetails = (info) => {
  const details = document.createElement("div");

  const toolDetails = `

   <dialog id="my_modal_${info.id}" class="w-10/12 p-5 rounded-lg">
            <div class="w-10/12 mx-auto my-4">
              <form method="dialog">
                <button
                  class="btn btn-sm btn-circle btn-ghost absolute right-0 top-0 text-red-600"
                >
                  ✕
                </button>
              </form>
              <!-- tool information START here -->
              <div class="grid md:grid-cols-2 gap-5 my-5">
                <div
                  class="bg-[#eb575715] p-5 border border-[#eb5757] rounded-lg"
                >
                  <h3 class="font-semibold text-xl" id="tooName">${
                    info.description
                  }</h3>

                  <div
                    class="my-3 flex flex-wrap justify-between items-center gap-5 text-center"
                  >
                   

                   ${
                     info?.pricing
                       ?.map((parce) =>
                         parce
                           ? `<div
                      class="bg-white p-3 text-center rounded-lg text-red-500"
                    >${parce.price}
                     <p>${parce.plan}</p>
                    </div> 
                    `
                           : "No data Found"
                       )
                       .join("") ?? "Not Found"
                   }
                  </div>
                  <div class="flex my-4">
                    <!-- features div -->
                    <div clas>
                      <h3 class="font-semibold text-xl" id="tooName">
                        Features
                      </h3>
                      <ul class="list-disc px-6">
                      <li>${info?.features.feature_name ?? "Not Found "}</li>
                      </ul>
                    </div>
                    <!-- features div -->
                    <!-- integration div -->
                    <div>
                      <h3 class="font-semibold text-xl" id="tooName">
                       Integrations
                      </h3>
                      <ul class="list-disc px-6">
                        ${
                          info?.integrations
                            ?.map((integration) =>
                              integration
                                ? `<li>${integration}</li>`
                                : "Data Not Found"
                            )
                            .join("") ?? "Data Not Found"
                        }
                      </ul>
                    </div>
                    <!-- integration div -->
                  </div>
                </div>
                <div
                  class="bg-red-200 border border-[#e7e7e7] bg-white rounded-lg p-5"
                >

                <div  class="relative">
                
                <div>
                 <figure>
              <img
                class="rounded-lg relative"
                src="${info?.image_link[0]}"
                alt="${info.tool_name}"
              />
            </figure></div>

             <div class="absolute top-3 right-5 mt-2">
              <button class="btn bg-red-500 hover:bg-red-600 text-white border-none font-bold text-xl">

              ${
                info?.accuracy.score
                  ? info?.accuracy?.score + " " + `accuracy`
                  : "Not Found"
              }
                
              </button>
            </div>
                </div>

                 <div>
                 <h3 class="font-semibold text-xl my-5 text-center" id="tooName">

                 ${
                   info.input_output_examples
                     ? info?.input_output_examples[0]?.input
                     : "Not Found"
                 }
                 
                 </h3>
                 <p class="text-center">  ${
                   info.input_output_examples
                     ? info?.input_output_examples[0]?.output
                     : "Not Found"
                 }</p>
                 </div>
                </div>
              </div>
              <!-- tool information END here -->
            </div>
          </dialog>
  
  `;

  details.innerHTML = toolDetails;
  showModal.appendChild(details);
};
// create tool card details END here

// show deatils function
const showDetails = async (id) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/ai/tool/${id}`
  );
  const data = await res.json();
  const tooDetails = data.data;
  // tooName.innerText = tooDetails.tool_name;
  createToolCardDetails(tooDetails);
  modalDisplay(tooDetails);
};

// show modal function
const modalDisplay = (tooDetails) => {
  const modalId = `my_modal_${tooDetails.id}`;
  const modal = getElement(modalId);
  modal.showModal(tooDetails);
};

// show all data fecth function
const displayData = (allAiTools) => {
  // show only 5 data
  allAiTools.slice(0, 5).forEach((tool) => {
    createTooCard(tool);
  });

  //   show all data
  if (allAiTools.length > 5) {
    showAllBtn.classList.remove("hidden");
    showAllBtn.addEventListener("click", () => {
      toolsContainer.innerHTML = "";
      allAiTools.forEach((tool) => {
        createTooCard(tool);
      });
      showAllBtn.classList.add("hidden");
    });
  }

  sortByDate.addEventListener("click", () => {
    allAiTools.sort((a, b) => {
      const dateA = new Date(a.published_in);
      const dateB = new Date(b.published_in);
      const result = dateA - dateB;
      return result;
    });

    toolsContainer.innerHTML = "";
    allAiTools.forEach((tool) => {
      createTooCard(tool);
    });
  });

  // handle search function
  searchBtn.addEventListener("click", () => {
    const inputText = searchInput.value.toLowerCase();
    toolsContainer.innerHTML = "";

    allAiTools.filter((data) => {
      const filterData = data.name.toLowerCase();

      if (filterData === inputText) {
        createTooCard(data);
        showAllBtn.classList.add("hidden");
        return;
      }
    });
    searchInput.value = "";
  });
};

loadData();
