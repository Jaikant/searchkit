const {
  SearchkitManager,SearchkitProvider,
  SearchBox, Hits, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  SelectedFilters, ResetFilters, RangeFilter, NumericRefinementListFilter,
  ViewSwitcherHits, ViewSwitcherToggle, DynamicRangeFilter,MenuFilter ,
  InputFilter, GroupedSelectedFilters, FastClick, FastClickComponent, PageSizeSelector
} = require("../../../../../src")

FastClick.component = FastClickComponent
const {
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar
} = require("../../../../../src")

const host = "http://demo.searchkit.co/api/movies"
import * as ReactDOM from "react-dom";
import * as React from "react";
const searchkit = new SearchkitManager(host)

searchkit.shouldPeformSearch = (query) => {
  return !!query.getQueryString()
}

require("./styles.scss")

const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = Object.assign({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">
        <img data-qa="poster" className={bemBlocks.item("poster")} src={result._source.poster} width="170" height="240"/>
        <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}>
        </div>
      </a>
    </div>
  )
}

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = Object.assign({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img data-qa="poster" src={result._source.poster}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2></a>
        <h3 className={bemBlocks.item("subtitle")}>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}

class App extends React.Component<any, any> {
  render(){
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo">Searchkit Acme co</div>
            <SearchBox autofocus={true} searchOnChange={true} prefixQueryFields={["actors^1","type^2","languages","title^10"]}/>
          </TopBar>

        <LayoutBody>

          <SideBar>
            <HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
            <DynamicRangeFilter field="metaScore" id="metascore" title="Metascore" rangeFormatter={(count)=> count + "*"}/>
            <RangeFilter min={0} max={10} translations={{"range.divider":" to "}} field="imdbRating" id="imdbRating" title="IMDB Rating" showHistogram={true} rangeFormatter={(count) => count + "*"}/>
            <InputFilter id="writers" searchThrottleTime={500} title="Writers" placeholder="Search writers" searchOnChange={true} queryFields={["writers"]} />
            <MenuFilter id="metascoreMenu" title="Metascore" field="metaScore" size={10}/>
            <RefinementListFilter id="ratingFacet" title="Raiting" field="imdbRating" operator="OR" size={10}/>
            <RefinementListFilter id="actorsFacet" title="Actors" field="actors.raw" size={10}/>
            <RefinementListFilter id="writersFacet" translations={{"facets.view_more":"View more writers"}} title="Writers" field="writers.raw" operator="OR" size={10}/>
            <RefinementListFilter id="countries" title="Countries" field="countries.raw" operator="OR" size={10}/>
            <NumericRefinementListFilter id="runtimeMinutes" title="Length" field="runtimeMinutes" options={[
              {title:"All"},
              {title:"up to 20", from:0, to:20},
              {title:"21 to 60", from:21, to:60},
              {title:"60 or more", from:61, to:1000}
            ]}/>
          </SideBar>
          <LayoutResults>
            <ActionBar>

              <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
                <ViewSwitcherToggle/>
                <PageSizeSelector options={[10, 20, 30]} />
                <SortingSelector options={[
                  {label:"Relevance", field:"_score", order:"desc"},
                  {label:"Latest Releases", field:"released", order:"desc"},
                  {label:"Earliest Releases", field:"released", order:"asc"}
                ]}/>                
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <ViewSwitcherHits
                highlightFields={["title","plot"]}
                sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year"]}
                hitComponents = {[
                  {key:"grid", title:"Grid", itemComponent:MovieHitsGridItem, defaultOption:true},
                  {key:"list", title:"List", itemComponent:MovieHitsListItem}
                ]}
                scrollTo="body"
            />
            <NoHits suggestionsField={"title"}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById("root"))
