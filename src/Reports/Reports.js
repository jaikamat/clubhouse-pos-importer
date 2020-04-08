import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GET_ALL_SALES } from '../api_resources';
import { Segment, Icon, Grid } from 'semantic-ui-react';
import Highcharts from 'highcharts';
import moment from 'moment';
import _ from 'lodash';

export default function Reports() {
    // const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);

            const { data } = await axios.get(GET_ALL_SALES);
            const { sales_data, format_legalities } = data;

            const groupByDay = _.groupBy(sales_data, d => moment(d.sale_data.timeStamp).startOf('day').format());

            const dailySalesTotals = {};
            const dailyAverageSales = {};
            const rangeBuckets = {
                0: 0, // $0.50 to $0.99
                1: 0, // $1.00 to $4.99 
                2: 0, // $5.00 to $9.99
                3: 0, // $10.00 to $19.99
                4: 0, // $20.00 to $49.99
                5: 0, // $50.00 and above
            };
            const rarityCounts = {};

            // Create daily sales totals
            _.forOwn(groupByDay, (val, key) => {
                dailySalesTotals[key] = val.reduce((acc, curr) => acc + curr.sale_data.total, 0);
            });

            // Create average sales totals
            _.forOwn(groupByDay, (val, key) => {
                dailyAverageSales[key] = val.reduce((acc, curr) => acc + curr.sale_data.total, 0) / val.length;
            });

            // Create range buckets for card prices
            const cards = [];
            sales_data.forEach(d => cards.push(...d.card_list));
            cards.forEach(c => {
                if (c.price >= 0.5 && c.price < 1) rangeBuckets[0] += c.qtyToSell;
                if (c.price >= 1 && c.price < 5) rangeBuckets[1] += c.qtyToSell;
                if (c.price >= 5 && c.price < 10) rangeBuckets[2] += c.qtyToSell;
                if (c.price >= 10 && c.price < 20) rangeBuckets[3] += c.qtyToSell;
                if (c.price >= 20 && c.price < 50) rangeBuckets[4] += c.qtyToSell;
                if (c.price >= 50) rangeBuckets[5] += c.qtyToSell;
            });

            // Create rarity sales counts
            cards.forEach(c => {
                if (rarityCounts[c.rarity]) {
                    rarityCounts[c.rarity] += c.qtyToSell
                } else {
                    rarityCounts[c.rarity] = c.qtyToSell;
                }
            });

            // Create format legality data
            const legalityCounts = { standard: 0, nonStandard: 0 };

            format_legalities.forEach(c => {
                const qtySold = c.qtyToSell;

                if (!c.legalities) return; // Some cards may not link via mongo $lookup

                if (c.legalities.standard === "legal") {
                    legalityCounts.standard += qtySold;
                } else {
                    legalityCounts.nonStandard += qtySold;
                }
            });

            // Format data for consumption by Highcharts API
            const formattedDailySalesTotals = Object.entries(dailySalesTotals).map(el => [new Date(el[0]).getTime(), el[1]]);

            const formattedDailyAverageSales = Object.entries(dailyAverageSales).map(el => [new Date(el[0]).getTime(), el[1]]);

            const formattedRangeBuckets = Object.entries(rangeBuckets).map(d => d[1]);

            const formattedRarityCounts = Object.entries(rarityCounts).map(d => ({ name: d[0], y: d[1] }));

            const formattedLegalities = Object.entries(legalityCounts).map(d => ({ name: d[0], y: d[1] }));

            setLoading(false);

            Highcharts.setOptions({
                lang: {
                    thousandsSep: ','
                }
            });

            Highcharts.chart('daily-sales', {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'Sales Over Time'
                },
                subtitle: {
                    text: 'Click and drag to zoom'
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: 'Date'
                    }
                },
                yAxis: {
                    title: {
                        text: 'USD ($)'
                    }
                },
                legend: {
                    enabled: true
                },
                series: [{
                    type: 'spline',
                    data: formattedDailySalesTotals,
                    name: 'Total Sales',
                    tooltip: {
                        valueDecimals: 2
                    }
                }, {
                    type: 'spline',
                    data: formattedDailyAverageSales,
                    name: 'Average Sales',
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            });

            Highcharts.chart('price-buckets', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Cards Sold Per Price Range'
                },
                subtitle: {
                    text: 'All-time'
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number sold'
                    }
                },
                xAxis: {
                    categories: [
                        '$0.50 - $0.99',
                        '$1.00 - $4.99',
                        '$5.00 - $9.99',
                        '$10.00 - $19.99',
                        '$20.00 - $49.99',
                        '$50.00 +'
                    ]
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: "Total cards",
                    data: formattedRangeBuckets
                }]
            });

            Highcharts.chart('rarity-sales', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: null,
                    type: 'pie'
                },
                title: {
                    text: 'Cards Sold Per Rarity'
                },
                subtitle: {
                    text: 'All-time'
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b><br>{point.percentage:.0f} %',
                            distance: -50,
                            filter: {
                                property: 'percentage',
                                operator: '>',
                                value: 4
                            }
                        },
                        colors: ['#7bb5ed', '#6798c8', '#4b769f', '#2d567c']
                    }
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: "Cards Sold",
                    data: formattedRarityCounts
                }]
            })

            Highcharts.chart('format-legalities', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: null,
                    type: 'pie'
                },
                title: {
                    text: 'Standard vs Non-Standard Sales'
                },
                subtitle: {
                    text: 'All-time'
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b><br>{point.percentage:.0f} %',
                            distance: -50,
                            filter: {
                                property: 'percentage',
                                operator: '>',
                                value: 4
                            }
                        },
                        colors: ['#7bb5ed', '#6798c8', '#4b769f', '#2d567c']
                    }
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: "Cards Sold",
                    data: formattedLegalities
                }]
            })
        })();
    }, []);

    return (
        <React.Fragment>
            <Segment secondary>
                <Icon name="exclamation triangle" color="blue" />
                This feature is currently in beta. Metrics may not be entirely accurate. Please contact your development team if you have any feedback!
            </Segment>
            <Segment loading={loading}>
                <div id="daily-sales" style={{ width: "100%", height: "400px" }} />
            </Segment>
            <Grid columns={2} stackable={true}>
                <Grid.Column>
                    <Segment loading={loading}>
                        <div id="price-buckets" style={{ width: "100%", height: "400px" }} />
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment loading={loading}>
                        <div id="rarity-sales" style={{ width: "100%", height: "400px" }} />
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment loading={loading}>
                        <div id="format-legalities" style={{ width: "100%", height: "400px" }} />
                    </Segment>
                </Grid.Column>
            </Grid>
        </React.Fragment>
    );
}