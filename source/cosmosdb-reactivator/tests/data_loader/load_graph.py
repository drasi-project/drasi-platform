
from gremlin_python.driver import client, serializer, protocol
from gremlin_python.driver.protocol import GremlinServerError
import sys
import traceback
import config

_gremlin_cleanup_graph = "g.V().drop()"

_gremlin_insert_vertices = [
    "g.addV('Employee').property('id', 'daniel').property('name', 'Daniel').property('gender', 'Male').property('email', 'sylvainniles@microsoft.com')",
    "g.addV('Employee').property('id', 'sylvain').property('name', 'Sylvain').property('gender', 'Male').property('email', 'danielgerlag@microsoft.com')",
    "g.addV('Employee').property('id', 'allen').property('name', 'Allen').property('gender', 'Male').property('email', 'alljones@microsoft.com')",
    "g.addV('Employee').property('id', 'ryan').property('name', 'Ryan').property('gender', 'Male').property('email', 'alljones@microsoft.com')",
    "g.addV('Employee').property('id', 'nicole').property('name', 'Nicole').property('gender', 'Female').property('email', 'alljones@microsoft.com')",
    "g.addV('Employee').property('id', 'donovan').property('name', 'Donovan').property('gender', 'Male').property('email', 'alljones@microsoft.com')",
    "g.addV('Employee').property('id', 'mark').property('name', 'Mark').property('gender', 'Male').property('email', 'alljones@microsoft.com')",
    "g.addV('Employee').property('id', 'greg').property('name', 'Greg').property('gender', 'Male').property('email', 'alljones@microsoft.com')",
    "g.addV('Employee').property('id', 'swati').property('name', 'Swati').property('gender', 'Female').property('email', 'alljones@microsoft.com')",
    "g.addV('Employee').property('id', 'lili').property('name', 'Lili').property('gender', 'Female').property('email', 'alljones@microsoft.com')",
    "g.addV('Employee').property('id', 'alice').property('name', 'Alice').property('gender', 'Female').property('email', 'alljones@microsoft.com')",
    "g.addV('Employee').property('id', 'bob').property('name', 'Bob').property('gender', 'male').property('email', 'alljones@microsoft.com')",
    "g.addV('Employee').property('id', 'charlie').property('name', 'Charlie').property('gender', 'male').property('email', 'alljones@microsoft.com')",

    "g.addV('Team').property('id', 'testteama').property('name', 'Test Team A')",
    "g.addV('Team').property('id', 'testteamb').property('name', 'Test Team B')",
    "g.addV('Team').property('id', 'testteamc').property('name', 'Test Team C')",
    "g.addV('Team').property('id', 'azinc').property('name', 'Azure Incubations')",
    "g.addV('Team').property('id', 'fuse').property('name', 'Fuse Labs')",
    "g.addV('Team').property('id', 'aocto').property('name', 'Azure Office of CTO')",

    "g.addV('Building').property('id', 'daniels_house').property('name', 'Daniels House')",
    "g.addV('Building').property('id', 'sylvains_house').property('name', 'Sylvains House')",
    "g.addV('Building').property('id', 'allens_house').property('name', 'Allens House')",
    "g.addV('Building').property('id', 'ryans_house').property('name', 'Ryans House')",
    "g.addV('Building').property('id', 'nicoles_house').property('name', 'Nicoles House')",
    "g.addV('Building').property('id', 'donovans_house').property('name', 'Donovans House')",
    "g.addV('Building').property('id', 'marks_house').property('name', 'Marks House')",
    "g.addV('Building').property('id', 'city_center').property('name', 'City Center')",
    "g.addV('Building').property('id', 'building_20').property('name', 'Building 20')",
    "g.addV('Building').property('id', 'building_99').property('name', 'Building 99')",
    "g.addV('Building').property('id', 'alices_house').property('name', 'Alices House')",
    "g.addV('Building').property('id', 'bobs_house').property('name', 'Bobs House')",
    "g.addV('Building').property('id', 'charlies_house').property('name', 'Charlies House')",

    "g.addV('Region').property('id', 'canada').property('name', 'Canada')",
    "g.addV('Region').property('id', 'redmond').property('name', 'Redmond')",
    "g.addV('Region').property('id', 'socal').property('name', 'Southern California')",
    "g.addV('Region').property('id', 'houston').property('name', 'Houston')",

    "g.addV('Incident').property('id', 'famine').property('name', 'Famine').property('description', 'A big famine').property('severity', 'high')",
    "g.addV('Incident').property('id', 'flood').property('name', 'Flood').property('description', 'A big flood').property('severity', 'high')",
    "g.addV('Incident').property('id', 'storm').property('name', 'Storm').property('description', 'A big storm').property('severity', 'high')",
    "g.addV('Incident').property('id', 'fire').property('name', 'Fire').property('description', 'A big fire').property('severity', 'high')"
]

_gremlin_insert_edges = [
    "g.V('daniel').addE('assigned_to').to(g.V('azinc'))",
    "g.V('sylvain').addE('assigned_to').to(g.V('azinc'))",
    "g.V('allen').addE('assigned_to').to(g.V('azinc'))",
    "g.V('ryan').addE('assigned_to').to(g.V('azinc'))",
    "g.V('nicole').addE('assigned_to').to(g.V('azinc'))",
    "g.V('donovan').addE('assigned_to').to(g.V('azinc'))",
    "g.V('mark').addE('assigned_to').to(g.V('aocto'))",
    "g.V('greg').addE('assigned_to').to(g.V('fuse'))",
    "g.V('swati').addE('assigned_to').to(g.V('fuse'))",
    "g.V('lili').addE('assigned_to').to(g.V('fuse'))",
    "g.V('alice').addE('assigned_to').to(g.V('testteama'))",
    "g.V('bob').addE('assigned_to').to(g.V('testteamb'))",
    "g.V('charlie').addE('assigned_to').to(g.V('testteamc'))",

    "g.V('ryan').addE('manages').to(g.V('azinc'))",
    "g.V('lili').addE('manages').to(g.V('fuse'))",
    "g.V('allen').addE('manages').to(g.V('testteama'))",
    "g.V('sylvain').addE('manages').to(g.V('testteamb'))",
    "g.V('daniel').addE('manages').to(g.V('testteamc'))",

    "g.V('daniel').addE('located_in').to(g.V('daniels_house'))",
    "g.V('sylvain').addE('located_in').to(g.V('sylvains_house'))",
    "g.V('allen').addE('located_in').to(g.V('allens_house'))",
    "g.V('ryan').addE('located_in').to(g.V('ryans_house'))",
    "g.V('nicole').addE('located_in').to(g.V('nicoles_house'))",
    "g.V('donovan').addE('located_in').to(g.V('donovans_house'))",
    "g.V('mark').addE('located_in').to(g.V('marks_house'))",
    "g.V('greg').addE('located_in').to(g.V('city_center'))",
    "g.V('swati').addE('located_in').to(g.V('building_20'))",
    "g.V('lili').addE('located_in').to(g.V('building_99'))",
    "g.V('alice').addE('located_in').to(g.V('alices_house'))",
    "g.V('bob').addE('located_in').to(g.V('bobs_house'))",
    "g.V('charlie').addE('located_in').to(g.V('charlies_house'))",

    "g.V('daniels_house').addE('located_in').to(g.V('canada'))",
    "g.V('sylvains_house').addE('located_in').to(g.V('redmond'))",
    "g.V('allens_house').addE('located_in').to(g.V('socal'))",
    "g.V('ryans_house').addE('located_in').to(g.V('redmond'))",
    "g.V('nicoles_house').addE('located_in').to(g.V('socal'))",
    "g.V('donovans_house').addE('located_in').to(g.V('houston'))",
    "g.V('marks_house').addE('located_in').to(g.V('redmond'))",
    "g.V('city_center').addE('located_in').to(g.V('redmond'))",
    "g.V('building_20').addE('located_in').to(g.V('redmond'))",
    "g.V('building_99').addE('located_in').to(g.V('redmond'))",
    "g.V('alices_house').addE('located_in').to(g.V('socal'))",
    "g.V('bobs_house').addE('located_in').to(g.V('redmond'))",
    "g.V('charlies_house').addE('located_in').to(g.V('canada'))",

    "g.V('famine').addE('occurs_in').to(g.V('canada'))",
    "g.V('flood').addE('occurs_in').to(g.V('redmond'))",
    "g.V('storm').addE('occurs_in').to(g.V('houston'))",
    "g.V('fire').addE('occurs_in').to(g.V('socal'))"
]

def print_status_attributes(result):
    # This logs the status attributes returned for successful requests.
    # See list of available response status attributes (headers) that Gremlin API can return:
    #     https://docs.microsoft.com/en-us/azure/cosmos-db/gremlin-headers#headers
    #
    # These responses includes total request units charged and total server latency time.
    # 
    # IMPORTANT: Make sure to consume ALL results returend by cliient tothe final status attributes
    # for a request. Gremlin result are stream as a sequence of partial response messages
    # where the last response contents the complete status attributes set.
    #
    # This can be 
    print("\tResponse status_attributes:\n\t{0}".format(result.status_attributes))

def cleanup_graph(client):
    print("\n> {0}".format(
        _gremlin_cleanup_graph))
    callback = client.submitAsync(_gremlin_cleanup_graph)
    if callback.result() is not None:
        callback.result().all().result() 
    print("\n")
    print_status_attributes(callback.result())
    print("\n")

def insert_vertices(client):
    for query in _gremlin_insert_vertices:
        print("\n> {0}\n".format(query))
        callback = client.submitAsync(query)
        if callback.result() is not None:
            print("\tInserted this vertex:\n\t{0}".format(
                callback.result().all().result()))
        else:
            print("Something went wrong with this query: {0}".format(query))
        print("\n")
        print_status_attributes(callback.result())
        print("\n")

    print("\n")


def insert_edges(client):
    for query in _gremlin_insert_edges:
        print("\n> {0}\n".format(query))
        callback = client.submitAsync(query)
        if callback.result() is not None:
            print("\tInserted this edge:\n\t{0}\n".format(
                callback.result().all().result()))
        else:
            print("Something went wrong with this query:\n\t{0}".format(query))
        print_status_attributes(callback.result())
        print("\n")

    print("\n")

try:
    client = client.Client(config.cosmosUri, 'g',
                           username=config.cosmosUserName,
                           password=config.cosmosPassword,
                           message_serializer=serializer.GraphSONSerializersV2d0()
                           )

    print("Welcome to Azure Cosmos DB + Gremlin on Python!")

    # Drop the entire Graph
    input("We're about to drop whatever graph is on the server. Press any key to continue...")
    cleanup_graph(client)

    # Insert all vertices
    input("Let's insert some vertices into the graph. Press any key to continue...")
    insert_vertices(client)

    # Create edges between vertices
    input("Now, let's add some edges between the vertices. Press any key to continue...")
    insert_edges(client)

except GremlinServerError as e:
    print('Code: {0}, Attributes: {1}'.format(e.status_code, e.status_attributes))

    # GremlinServerError.status_code returns the Gremlin protocol status code
    # These are broad status codes which can cover various scenaios, so for more specific
    # error handling we recommend using GremlinServerError.status_attributes['x-ms-status-code']
    # 
    # Below shows how to capture the Cosmos DB specific status code and perform specific error handling.
    # See detailed set status codes than can be returned here: https://docs.microsoft.com/en-us/azure/cosmos-db/gremlin-headers#status-codes
    #
    # See also list of available response status attributes that Gremlin API can return:
    #     https://docs.microsoft.com/en-us/azure/cosmos-db/gremlin-headers#headers
    cosmos_status_code = e.status_attributes["x-ms-status-code"]
    if cosmos_status_code == 409:
        print('Conflict error!')
    elif cosmos_status_code == 412:
        print('Precondition error!')
    elif cosmos_status_code == 429:
        print('Throttling error!');
    elif cosmos_status_code == 1009:
        print('Request timeout error!')
    else:
        print("Default error handling")

    traceback.print_exc(file=sys.stdout) 
    sys.exit(1)

print("\nAnd that's all! Sample complete")
input("Press Enter to continue...")