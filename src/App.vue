<template>
    <div class="root">
        Hello
        <table class="test">
            <tbody>
            <tr v-for="row in data">
                <td v-for="cell in row">{{ cell }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {watcher} from './Clipboard/Watcher'

export default {
    name: "App",
    data() {
        return {
            data: []
        }
    },
    mounted() {
        this.stopWatch = watcher(data => {
            this.data = data;
        });
    },
    unmounted() {
        this.stopWatch();
    }
}
</script>

<style lang="scss" scoped>

div.root {
    border: 1px dotted gray;
    padding: 8px;
    display: block;
    min-width: 100px;
    min-height: 100px;
    color: blue;
    font-weight: bolder;
    font-size: 18px;

    table.test {
        border: 1px solid black;
        padding: 0;
        margin: 0;
        border-collapse: separate;
        border-spacing: 0;

        tr {
            padding: 0;
            margin: 0;
            height: 30px;

            &:last-child {
                border-bottom: 0;

                td {
                    border-bottom: 0;
                }
            }

            td {
                border-right: 1px solid black;
                border-bottom: 1px solid black;
                padding: 0 8px;
                margin: 0;
                font-size: 12px;

                &:last-child {
                    border-right: 0;
                }
            }
        }
    }
}
</style>