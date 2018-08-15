const chai = require('chai'); 
const chaiHttp = require('chai-http'); 

const {app, runServer, closeServer } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp); 

describe("Recipes", function(){

	before(function(){
		return runServer(); 
	});

	after(function(){
		return closeServer(); 
	})

	it('should list recipes on GET', function(){
		return chai.request(app)
			.get('/recipes')
				.then(function(res){
					expect(res).to.have.status(200); 
					expect(res).to.be.json;
					expect(res.body).to.be.an('array');
					expect(res.body.length).to.be.at.least(1); 

					const expectedKeys = ["name", "id", "ingredients"];

					res.body.forEach(function(item){
						expect(item).to.be.an('object');
						expect(item).to.include.keys(expectedKeys)
					});
				});
	});

	it('should add an item on POST', function(){

		const newItem = {
			name: "carbonara",
			ingredients: [
				"chicken",
				"bacon", 
				"pasta"
			]
		}

		return chai.request(app)
			.post('/recipes')
			.send(newItem)
			.then(function(res){
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body).to.include.keys('name', 'id', 'ingredients'); 
				expect(res.body.id).to.not.equal(null); 
				expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
			});
	});

	it('should update items on PUT', function(){
		const updatedItem = {
			name: "test",
			ingredients: [
				"test steak",
				"test brocolli",
				"test potatoes"
			]
		};

		return chai.request(app)
			.get('/recipes')
			.then(function(res){
				updatedItem.id = res.body[0].id; 
				return chai.request(app)
					.put(`/recipes/${updatedItem.id}`)
					.send(updatedItem)
			})
			.then(function(res){
				expect(res).to.have.status(204);
			});
		});

	it('should delete on DELETE', function(){

		return chai.request(app)
			.get('/recipes')
			.then(function(res){
				const itemId = res.body[0].id
				return chai.request(app)
					.delete(`/recipes/${itemId}`)
			})
			.then(function(res){
				expect(res).to.have.status(204);
			})

	})


});
























