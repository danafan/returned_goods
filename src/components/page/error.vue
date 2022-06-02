<template>
	<div class="error">
        404无此页面
	</div>
</template>

<script>
	import $axios from '@/axios/http.js'
	export default {
		name: 'error',
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		mounted() {
			
		},
		created() {
			document.title = "404"
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	
</style>