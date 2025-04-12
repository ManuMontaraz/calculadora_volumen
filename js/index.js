const VOLUME_FORM = document.querySelector("#volume_form")
const RESULT = document.querySelector("#result")
const SEARCH = get_search()
let _autoClic = false


function get_search(){
    try {
        return JSON.parse(atob(location.search.substring(1)))
    } catch {
        return false
    }
}

VOLUME_FORM.addEventListener("submit", (event)=>{
    event.preventDefault()
    
    const Inputs = VOLUME_FORM.querySelectorAll("*:not(.hide) > input,*:not(.hide) > select")
    const SearchForm = {}

    let anyError = false
    let delay = 0
    for(let indexInput = 0; indexInput < Inputs.length; indexInput++){
        const Input = Inputs[indexInput]
        const Name = Input.name
        const Value = Input.value

        if(!Value || Value == ""){
            anyError = true
            if(_autoClic)continue
            setTimeout(()=>{
                Input.classList.add("error")
            }, delay)

            setTimeout(()=>{
                Input.classList.remove("error")
            }, 500+delay)

            delay+=100
        }else SearchForm[Name] = Value
    }

    _autoClic = false

    if(anyError){
        RESULT.classList.add("hide")
        return
    }else{
        RESULT.classList.remove("hide")

        const ListResults = RESULT.querySelector("#list_results")
        const ObjectResult = calculate_volume()
        const ArrayResult = Object.entries(ObjectResult)

        ListResults.innerHTML = ""

        for(let indexResult = 0; indexResult < ArrayResult.length; indexResult++){
            const [Name, Value] = ArrayResult[indexResult]
            ListResults.insertAdjacentHTML(
                "beforeend",
                `<li>
                    <p><b class="write_name" name="${Name}"></b>: <span class="write_value" value="${Value}">ml.</span></p>
                </li>`
            )
        }
    }

    
    //console.log("SearchForm",SearchForm)
    window.history.replaceState(null, document.title, `${location.pathname}?${btoa(JSON.stringify(SearchForm).trim())}`)
    //location.search = btoa(JSON.stringify(SearchForm).trim())
})

VOLUME_FORM.addEventListener("input", update_parameters)

function update_parameters(){
    
    _autoClic = true
    VOLUME_FORM.querySelector("#submit_volume_form").click()
    update_materials()
}

function update_materials(){
    const Material = VOLUME_FORM.querySelector("#material")
    const ElementSecondMaterial = VOLUME_FORM.querySelector("#list_percentaje_second_material")
    const NameSecondMaterial = ElementSecondMaterial.querySelector("#name_percentaje_second_material")
    const InputSecondMaterial = ElementSecondMaterial.querySelector("#percentage_second_material")

    const ValueResultMaterial = RESULT.querySelector("#value_result_material")
    const NameResultMaterial = RESULT.querySelector("#name_result_material")
    
    const NameMaterial =  Material.selectedOptions[0].textContent
    const DensityMaterial = Material.selectedOptions[0].getAttribute("density")
    const SecondMaterial = Material.selectedOptions[0].getAttribute("second-material")
    const PlaceholderSecondMaterial = Material.selectedOptions[0].getAttribute("second-material-placeholder")

    //if(NameMaterial)NameResultMaterial.setAttribute("name",NameMaterial)
    //else NameResultMaterial.setAttribute("name","[NONAME]")

    /*
    if(DensityMaterial){
        const ObjectResult = calculate_volume()
        ValueResultMaterial.setAttribute("value",ObjectResult[NameMaterial])
    }else ValueResultMaterial.setAttribute("value","[NOVALUE]")
    */
    if(SecondMaterial){
        ElementSecondMaterial.classList.remove("hide")
        NameSecondMaterial.setAttribute("name",SecondMaterial)
        InputSecondMaterial.setAttribute("placeholder",PlaceholderSecondMaterial)
    }else{
        ElementSecondMaterial.classList.add("hide")
        NameSecondMaterial.setAttribute("name","[NONAME]")
        InputSecondMaterial.setAttribute("placeholder","")
    }

    console.log("Material",Material)
}

function calculate_volume(){
    const Material = VOLUME_FORM.querySelector("#material")
    const NameMaterial =  Material.selectedOptions[0].textContent
    const DensityMaterial = Material.selectedOptions[0].getAttribute("density")
    const Volume = VOLUME_FORM.querySelector("#water_ml").value
    const SecondMaterial = Material.selectedOptions[0].getAttribute("second-material")
    const PercentageSecondMaterial = VOLUME_FORM.querySelector("#percentage_second_material").value

    const ObjectResult = {}
    //let result = 0
    if(DensityMaterial && Volume){
        ObjectResult[NameMaterial] = (Volume * DensityMaterial).toFixed(2)
        if(SecondMaterial){
            const VolumeSecondMaterial = (ObjectResult[NameMaterial] * PercentageSecondMaterial / 100).toFixed(2)
            ObjectResult[SecondMaterial] = VolumeSecondMaterial
            ObjectResult[NameMaterial] = (ObjectResult[NameMaterial] - VolumeSecondMaterial).toFixed(2)
        }
    }//else result = "[NOVALUE]"

    console.log("ObjectResult",ObjectResult)
    return ObjectResult
}

document.addEventListener("DOMContentLoaded", ()=>{
        const ArraySearch = Object.entries(SEARCH)
    
        for(let indexSearch = 0; indexSearch < ArraySearch.length; indexSearch++){
            const [Name, Value] = ArraySearch[indexSearch]
            VOLUME_FORM.querySelector(`#${Name}`).value = Value
        }
        
        update_parameters()

        _autoClic = true
        if(SEARCH)VOLUME_FORM.querySelector("#submit_volume_form").click()
})