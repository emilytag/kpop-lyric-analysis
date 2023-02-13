import * as d3 from 'd3';
import { useRef, useEffect } from "react";
import songData from "../data/all_songs.json"

const height = 550;
const width = 800;
const margin = { top: 10, right: 10, bottom: 15, left: 30 },
    width1 = width - margin.left - margin.right,
    height1 = height - margin.top - margin.bottom;
const xOffset = 25;

// TODO color coding for language on lyrics
// TODO animation for lyrics change

export function drawArtistChart(svg, artist, color) {
    svg.attr("width", width)
        .attr("height", height)

    svg.append("rect")
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white')

    const artistData = songData.filter(function (d) {
        return d.artist_info.name == artist
    })

    const x_min = d3.min(artistData, function (d) { 
        const min_date = new Date(d.song_info.release_date) 
        return min_date.setMonth(min_date.getMonth() - 2)
    });
    const x_max = d3.max(artistData, function (d) { return new Date(d.song_info.release_date) });

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

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(${xOffset}, ${height1})`)
        .call(xAxis);
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${xOffset}, 0)`)
        .call(yAxis);

    svg.selectAll(".artistcircles")
        .data(artistData)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(new Date(d.song_info.release_date)) + xOffset; })
        .attr("cy", function (d) { return yScale(d.song_info.ratio); })
        .attr("title", function (d) { return d.song_info.title })
        .attr("title_track", function (d) { return d.song_info.title_track || false })
        .attr("artist", function (d) { return d.artist_info.name })
        .attr("lyrics", function(d) { return d.song_info.lyrics })
        .style("fill", color)
        .style("opacity", '0.75')
        .attr("r", 4)
        .on('mouseover', function (d) {
            const xpos = parseFloat(d3.select(this).attr("cx")) + 330
            const ypos = parseFloat(d3.select(this).attr("cy")) + 240
            d3.select("#artistTooltip")
                .style("left", `${xpos}px`)
                .style("top", `${ypos}px`)
                .select("#value")
                .text(`${d3.select(this).attr("title")}`)

            d3.select("#artistTooltip").classed("hidden", false)
        })
        .on('mouseout', function (d) {
            d3.select("#artistTooltip").classed("hidden", true)
        })
        .on('click', function (d) {
            d3.select('.preview__item-box--right')
            .select('p')
            .text(d3.select(this).attr("lyrics"))
        })
}