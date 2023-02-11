import * as d3 from 'd3';
import songData from "../data/all_songs.json"
import yearAverages from "../data/year_averages.json"
import artistInfo from "../data/group_companies.json"
import { useRef, useEffect, useState } from "react";
import { showSpotlight } from './artist-spotlight';

const height = 930;
const width = 1000;
const margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width1 = width - margin.left - margin.right,
    height1 = height - margin.top - margin.bottom;
const xOffset = 25;

const colorPalette = {
    "first generation": '#F2CD5C',
    "second generation": '#F2921D',
    "third generation": '#A61F69',
    "fourth generation": '#400E32'
}

const companyPalette = {
    "SM Entertainment": "#8BBCCC",
    "JYP": "#4C6793",
    "YG Entertainment": "#5C2E7E",
    "Hybe": "#000000"
}

function drawChart(svg) {
    // set up axes
    const x_min = d3.min(songData, function (d) { return new Date(d.song_info.release_date) });
    const x_max = d3.max(songData, function (d) { return new Date(d.song_info.release_date) });

    const xScale = d3.scaleTime()
        .domain([x_min, x_max]) //scale of the chart
        .range([0, width1]); //scale of the canvas

    const yScale = d3.scaleLinear()
        .domain([0, 0.8])
        .range([height1, 5]);

    const xAxis = d3.axisBottom()
        .scale(xScale);
    const yAxis = d3.axisLeft()
        .scale(yScale);

    // set up chart size
    svg.attr("width", width)
        .attr("height", height)
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // for (const year in yearAverages) {
    //     const yearStart = `${year}-01-01`
    //     const yearEnd = `${year}-12-31`
    //     svg.append("line")
    //     .attr("x1", xScale(new Date(yearStart)) + xOffset)
    //     .attr("x2", xScale(new Date(yearEnd)) + xOffset)
    //     .attr("y1", yScale(yearAverages[year]))
    //     .attr("y2", yScale(yearAverages[year]))
    //     .style("stroke", "#efefef")
    //     .style("stroke-width", 5)
    // }

    svg.selectAll("circle")
        .data(songData)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(new Date(d.song_info.release_date)) + xOffset; })
        .attr("cy", function (d) { return yScale(d.song_info.ratio); })
        .attr("title", function (d) { return d.song_info.title })
        .attr("title_track", function (d) { return d.song_info.title_track || false })
        .attr("artist", function (d) { return d.artist_info.name })
        .attr("generation", function (d) { return d.artist_info.generation })
        .attr("company", function (d) { return artistInfo[d.artist_info.name] })
        .style("fill", function (d) { return colorPalette[d.artist_info.generation] })
        .style("opacity", '0.75')
        .attr("r", 4)
        .on('mouseover', function (d) {
            const xpos = parseFloat(d3.select(this).attr("cx")) + 40
            const ypos = parseFloat(d3.select(this).attr("cy")) + 10
            d3.select("#tooltip")
                .style("left", `${xpos}px`)
                .style("top", `${ypos}px`)
                .select("#value")
                .text(`${d3.select(this).attr("artist")} - ${d3.select(this).attr("title")}`)

            d3.select("#tooltip").classed("hidden", false)
        })
        .on('mouseout', function (d) {
            d3.select("#tooltip").classed("hidden", true)
        })
        .on('click', function () {
            d3.select(".preview__item-title")
            .select('span')
            .text(d3.select(this).attr("artist"))

            d3.select('.preview__item-subtitle')
            .select('span')
            .text(d3.select(this).attr("company"))

            d3.select('.preview__item-meta')
            .select('span')
            .text(d3.select(this).attr("generation"))

            d3.select('.content__overlay')
            .style("background", d3.select(this).style('fill'))
            
            showSpotlight(d3.select('.preview__item').node())
        });

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(${xOffset}, ${height1})`)
        .call(xAxis);
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${xOffset}, 0)`)
        .call(yAxis);

    d3.selectAll("input[name='filterPreset']")
        .on("click", function () {

            var view = d3.select(this).node().value;

            switch (view) {

                case "first generation":
                case "second generation":
                case "third generation":
                case "fourth generation":
                    const subset = songData.filter((d) => { return d.artist_info.generation == view })
                    xScale.domain([d3.min(subset, function (d) { return new Date(d.song_info.release_date) }), d3.max(subset, function (d) { return new Date(d.song_info.release_date) })]);
                    svg.selectAll("circle")
                        .data(songData)
                        .transition()
                        .duration(500)
                        .style("opacity", function (d) {
                            if (d.artist_info.generation != view) {
                                return "0"
                            } else {
                                return "0.75"
                            }
                        })
                        .attr("cx", function (d) {
                            if (d.artist_info.generation == view) {
                                return xScale(new Date(d.song_info.release_date)) + xOffset;
                            } else {
                                return d3.select(this).attr("cx")
                            }
                        })
                        .attr("cy", function (d) {
                            if (d.artist_info.generation != view) {
                                return yScale("-1.0")
                            } else {
                                return yScale(d.song_info.ratio)
                            }
                        })

                    svg.selectAll(".x-axis")
                        .transition()
                        .duration(400)
                        .call(xAxis);

                    break;
            }
        })
    d3.selectAll("input[name='titleTracks']")
        .on("click", function () {
            let currentGen
            try {
                currentGen = d3.select('input[name="filterPreset"]:checked').node().value
            } catch (TypeError) {
                currentGen = undefined
            }
            const checked = d3.select(this).property("checked");
            if (checked) {
                d3.selectAll("circle")
                    .filter(function (d) {
                        return !d.song_info.title_track
                    })
                    .transition()
                    .duration(500)
                    .style("opacity", "0")
                    .attr("cy", yScale("-1.0"))
            } else {
                d3.selectAll("circle")
                    .filter(function (d) {
                        if (currentGen) {
                            return d.artist_info.generation == currentGen
                        } else {
                            return d
                        }
                    })
                    .transition()
                    .duration(500)
                    .style("opacity", "0.75")
                    .attr("cy", function (d) { return yScale(d.song_info.ratio) })
            }
        })
    d3.selectAll("input[name='bigFour']")
        .on("click", function () {
            let currentGen
            try {
                currentGen = d3.select('input[name="filterPreset"]:checked').node().value
            } catch (TypeError) {
                currentGen = undefined
            }
            const checked = d3.select(this).property("checked");
            if (checked) {
                d3.selectAll("circle")
                    .filter(function (d) {
                        return !Object.keys(companyPalette).includes(d3.select(this).attr("company"))
                    })
                    .transition()
                    .duration(500)
                    .style("opacity", "0")
                    .attr("cy", yScale("-1.0"))
                d3.selectAll("circle")
                    .filter(function (d) {
                        return Object.keys(companyPalette).includes(d3.select(this).attr("company"))
                    })
                    .transition()
                    .duration(500)
                    .style("fill", function (d) { return companyPalette[d3.select(this).attr("company")] })
            } else {
                d3.selectAll("circle")
                    .filter(function (d) {
                        if (currentGen) {
                            return d.artist_info.generation == currentGen
                        } else {
                            return d
                        }
                    })
                    .transition()
                    .duration(500)
                    .style("opacity", "0.75")
                    .attr("cy", function (d) { return yScale(d.song_info.ratio) })
                    .style("fill", function (d) { return colorPalette[d.artist_info.generation] })
            }
        })
    d3.selectAll("button")
        .on("click", function () {
            xScale.domain([x_min, x_max])
                .range([0, width1]);

            svg.selectAll("circle")
                .transition()
                .duration(500)
                .style("opacity", "0.75")
                .attr("cx", function (d) {
                    return xScale(new Date(d.song_info.release_date)) + xOffset;

                })
                .attr("cy", function (d) {
                    return yScale(d.song_info.ratio)
                })
                .style("fill", function (d) { return colorPalette[d.artist_info.generation] })

            svg.selectAll(".x-axis")
                .transition()
                .duration(400)
                .call(xAxis);

            d3.selectAll("input").property("checked", false)
        });
}

const Chart = () => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current)
        drawChart(svg);
    }, [ref]);

    return (
        <div>
            <svg ref={ref} />
            <div id="tooltip" className="hidden">
                <p><span id="value"></span></p>
            </div>
            <div id="legendOptions">
                <label><input type="radio" name="filterPreset" value="first generation" /> first generation </label>
                <label><input type="radio" name="filterPreset" value="second generation" /> second generation </label>
                <label><input type="radio" name="filterPreset" value="third generation" /> third generation </label>
                <label><input type="radio" name="filterPreset" value="fourth generation" /> fourth generation</label>
                <label><input type="checkbox" name="titleTracks" value="title tracks only" /> title tracks only </label>
                <label><input type="checkbox" name="bigFour" value="big four only" /> big four only </label>
                <button type="reset">reset</button>
            </div>
        </div>
    );
}

export default Chart;